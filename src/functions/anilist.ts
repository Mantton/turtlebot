import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
import { MEDIA_QUERY } from "../anilist/queries";
import { reactNotFound, truncate } from "./mangasoup";
import { expressions } from "./matcher";

const API_URL = "https://graphql.anilist.co";
const IMAGE_URL = "https://img.anili.st/media";

export const recommend = async (message: Message) => {
  const target = message.content.match(expressions[4])?.[1];

  if (!target) {
    reactNotFound(message);
    return;
  }
  const data = await callApi(target, true);
  const result = data.data.Page.media[0];
  const recommendations: any[] = [];
  result.recommendations.nodes.forEach((elem: any) => {
    const title = `${elem.mediaRecommendation.title.userPreferred}`;
    recommendations.push({
      title,
    });
  });
  if (recommendations.length == 0) {
    reactNotFound(message);
    return;
  }

  const selection =
    recommendations[Math.floor(Math.random() * recommendations.length)];
  await prepareResult(selection.title, true, message);
};
export const getManga = async (message: Message): Promise<void> => {
  const target = message.content.match(expressions[3]);
  const re = /<.*?https?:\/\/.*?>|<a?:.+?:\d*>|`[\s\S]*?`|<(.*?)>/;
  if (!target) {
    return;
  }
  for (const result of target) {
    const title = result.match(re)?.[1];
    if (title) prepareResult(title, true, message);
  }
  return;
};

export const getAnime = async (message: Message): Promise<void> => {
  const target = message.content.match(expressions[2]);
  const re = /`[\s\S]*?`|{(.*?)}/;
  if (!target) {
    return;
  }
  for (const result of target) {
    const title = result.match(re)?.[1];
    if (title) prepareResult(title, false, message);
  }
  return;
};

function getTitle(data: any): string {
  return data.english || data.romaji || data.native;
}

async function callApi(query: string, isManga: boolean) {
  const data = {
    query: MEDIA_QUERY,
    variables: {
      search: query.trim(),
      type: isManga ? "MANGA" : "ANIME",
      exclude: "NOVEL",
      perPage: 5,
      page: 1,
    },
  };
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const response = await axios({
    url: API_URL,
    method: "POST",
    headers,
    data: data,
    timeout: 10000,
  });

  return response.data;
}

async function prepareResult(
  query: string,
  isManga: boolean,
  message: Message
) {
  const response = await callApi(query, isManga).catch((err) => {
    // reactNotFound(message);
  });

  if (!response) return;

  const result = response.data.Page.media[0];

  if (!result) return;
  const genres = result.genres?.join(", ") ?? "";

  const description = `${truncate(result.description, 250, true)} [(more)](${
    result.siteUrl
  })`;
  const messageResponse = new MessageEmbed()
    .setColor(result.coverImage.color || "#6A5ACD")
    .setTitle(getTitle(result.title))
    .setURL(result.siteUrl)
    .setImage(`${IMAGE_URL}/${result.id}`)
    .setDescription(description)
    .setTimestamp()
    .setFooter(
      isManga ? "Manga" : "Anime",
      "https://anilist.co/img/logo_al.png"
    );
  if (isManga) {
    messageResponse.setAuthor(
      "View results in app",
      "https://cdn.discordapp.com/emojis/833202441309650944.png?v=1", // MangaSoup Thumbnail
      `https://mangasoup.net/anilist/${result.id}`
    );
    if (genres) messageResponse.addFields({ name: "Genres", value: genres });
    const chapters = result.chapters;
    let body = "";
    let status = "Status Unknown";
    switch (result.status) {
      case "RELEASING":
        status = "Ongoing";
        break;
      case "FINISHED":
        status = "Completed";
        break;
      case "CANCELLED":
        status = "Cancelled";
        break;
      case "HIATUS":
        status = "Hiatus";
        break;
      default:
        break;
    }
    if (chapters) {
      const formattedString = `${chapters} Chapter(s)\n`;
      body = formattedString;
    }
    if (result.synonyms.length > 0) {
      const titles = "Also called " + result.synonyms.join(", ") + "\n";
      body = body + titles;
    }
    body = body + status;
    if (body.trim().length != 0)
      messageResponse.addFields({ name: "Additional Info", value: body });
  }

  message.channel.send(messageResponse);
}
