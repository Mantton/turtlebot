export enum Command {
  animeSearch,
  mangaSearch,
  openInApp,
  readLater,
  recommend,
  noMatch,
}

export const expressions = [
  /^!open\s+<?(https?:\/\/.*|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>?/, // MS ID or Direct Link
  /^!bookmark\s+<?(https?:\/\/.*|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>?/,
  /`[\s\S]*?`|{(.*?)}/g, // Anime
  /<.*?https?:\/\/.*?>|<a?:.+?:\d*>|`[\s\S]*?`|<(.*?)>/g, // Manga
  /^!rec (.*)/,
];

export const matcher = (message: string): Command => {
  for (let i = 0; i < expressions.length; i++) {
    if (message.match(expressions[i])) {
      switch (i) {
        case 0:
          return Command.openInApp;
        case 1:
          return Command.readLater;
        case 2:
          return Command.animeSearch;
        case 3:
          return Command.mangaSearch;
        case 4:
          return Command.recommend;
      }
    }
  }

  return Command.noMatch;
};
