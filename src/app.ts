import { Client } from "discord.js";
import { resolve } from "./funcs";

import dotenv from "dotenv";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path").resolve(__dirname, "..");
dotenv.config({ path: path + "/.env" });

if (require.main === module) {
  main();
}

function main() {
  const client = new Client();
  const token = process.env.TOKEN;

  client.once("ready", () => {
    console.log(`Ready!\nBOT : ${client.user?.username}`);
  });
  client.login(token);

  client.on("message", (message) => {
    if (message.author.id == client.user?.id) {
      return;
    }

    if (message.content.toLowerCase().includes("good bot")) {
      const positiveReactions = [
        "833208865923399691",
        "860320764720840755",
        "833208866253963304",
        "833203621734514708",
        "860320765093216266",
        "833210734422261821",
      ];
      const reaction =
        positiveReactions[Math.floor(Math.random() * positiveReactions.length)];
      message.react(reaction);
      return;
    }

    if (message.content.toLowerCase().includes("bad bot")) {
      const negativeReactions = [
        "833210734635647057",
        "833208867121922069",
        "862765419080843356",
        "833208866463416340",
        "833208866313207859",
      ];
      const reaction =
        negativeReactions[Math.floor(Math.random() * negativeReactions.length)];

      message.react(reaction);

      return;
    }

    resolve(message);
    return;
  });
}

/// Todo
// Anilist
// MAL
// Save for later
// MS Profile from link
