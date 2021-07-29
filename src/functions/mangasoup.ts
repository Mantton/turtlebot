import axios from "axios";
import { Message, MessageEmbed } from "discord.js";

const MS_PARSER = "https://parser.mangasoup.net";
const MS_STATS = "https://stats.mangasoup.net";

export const openLink = async (message: Message): Promise<void> => {
  //^!open\s+<?(https?:\/\/.*|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>?
  // Check if pointer is link or MS ID

  const regex = {
    initial:
      /^!open\s+<?(https?:\/\/.*|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>?/,
    url: /^https?:\/\/.*/,
    msId: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
  };
  const target = message.content.match(regex.initial)?.[1];

  if (!target) {
    reactNotFound(message);
    return;
  }
  if (target.match(regex.url)) {
    const comicId = target;
    if (comicId) {
      try {
        const response = await axios.get(MS_PARSER + `/comic/url`, {
          params: { url: target.trim().split(">")[0] },
        });
        const comic = response.data;

        returnMangaSoupComic(message, comic);
      } catch (err) {
        // log err
        reactNotFound(message);
      }
    } else reactNotFound(message);

    return;
  }

  if (target.match(regex.msId)) {
    const comicId = target;
    if (comicId) {
      try {
        const response = await axios.get(MS_PARSER + `/comic/ms/${comicId}`);
        const comic = response.data;

        returnMangaSoupComic(message, comic);
      } catch (err) {
        // log err
        reactNotFound(message);
      }
    } else reactNotFound(message);

    return;
  }
  return;
};

export const reactNotFound = (message: Message): void => {
  message.react("860320765193879562");
  return;
};

function returnMangaSoupComic(message: Message, comic: any) {
  const UNI_BASE = "https://mangasoup.net/comic/";
  const MS_THUMBNAIL =
    "https://cdn.discordapp.com/emojis/833202441309650944.png?v=1";
  const response = new MessageEmbed()
    .setColor("#6A5ACD")
    .setTitle(comic.title)
    .setURL(comic.webUrl)
    .setAuthor(
      "Open In App",
      MS_THUMBNAIL,
      `${UNI_BASE}/${comic.sourceId}/${comic.comicId}`
    )
    .setDescription(truncate(comic.summary, 256, true))
    .setThumbnail(comic.image.link)
    .setTimestamp()
    .setFooter(
      "Prepared by MangaSoup, Parsed from " + comic.sourceName,
      MS_THUMBNAIL
    );

  if (comic.properties.length > 0 && comic.properties[0].tags.length > 0) {
    const tags = comic.properties[0].tags; // always returns the main identifiers

    const tagString = tags.map((x: any) => x.label).join(", ");
    response.addFields({ name: "Genres", value: tagString });
  }
  // Additional Title
  if (comic.additionalTitles.length > 0) {
    const titles = comic.additionalTitles.join(", ");
    response.addFields({ name: "Other Names", value: titles });
  }

  // Creators
  if (comic.creators.length > 0) {
    const creators = comic.creators.join(", ");
    response.addFields({ name: "Credits", value: creators });
  }

  response.addFields({ name: "MSID", value: comic.id });

  message.channel.send(response);
}

function truncate(str: string, n: number, useWordBoundary: boolean) {
  if (str.length <= n) {
    return str;
  }
  const subString = str.substr(0, n - 1); // the original check
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
}
