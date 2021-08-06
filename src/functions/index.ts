import { Message } from "discord.js";
import { getAnime, getManga, recommend } from "./anilist";
import { openLink, reactNotFound } from "./mangasoup";
import { Command, matcher } from "./matcher";

export * from "./matcher";
export * from "./anilist";
export * from "./mangasoup";

export const resolve = async (message: Message): Promise<void> => {
  const command = matcher(message.cleanContent);
  switch (command) {
    case Command.animeSearch:
      await getAnime(message);
      break;
    case Command.mangaSearch:
      await getManga(message);
      break;
    case Command.openInApp:
      await openLink(message);
      break;
    case Command.readLater:
      reactNotFound(message);
      break;
    case Command.recommend:
      await recommend(message);
      break;

    default:
      break;
  }
  return;
};
