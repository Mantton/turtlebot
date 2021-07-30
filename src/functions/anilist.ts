import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
import { title } from "process";
import { MEDIA_QUERY } from "../anilist/queries";
import { reactNotFound, truncate } from "./mangasoup";
import { expressions } from "./matcher";

const API_URL = "https://graphql.anilist.co";
const IMAGE_URL = "https://img.anili.st/media";

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

async function prepareResult(
  query: string,
  isManga: boolean,
  message: Message
) {
  const data = {
    query: MEDIA_QUERY,
    variables: {
      search: query.trim(),
      type: isManga ? "MANGA" : "ANIME",
      exclude: "NOVEL",
      perPage: 50,
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
  }).catch((err) => {
    message.channel.send("!");
  });

  if (!response) return;

  const result = response.data.data.Page.media[0];

  if (!result) {
    reactNotFound(message);
  }
  const genres = result.genres.join(", ");

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
    messageResponse.addFields({ name: "Genres", value: genres });
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
    if (body.trim().length != 0)
      messageResponse.addFields({ name: "Additional Info", value: body });
  }

  message.channel.send(messageResponse);
}
