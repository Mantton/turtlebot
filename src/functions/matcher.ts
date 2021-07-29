export enum Command {
  animeSearch,
  mangaSearch,
  openInApp,
  readLater,
  noMatch,
}

export const expressions = [
  /^!open\s+<?(https?:\/\/.*|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>?/, // MS ID or Direct Link
  /^!bookmark\s+<?(https?:\/\/.*|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>?/,
  /`[\s\S]*?`|{(.*?)}/, // Anime
  /<.*?https?:\/\/.*?>|<a?:.+?:\d*>|`[\s\S]*?`|<(.*?)>/, // Manga
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
      }
    }
  }

  return Command.noMatch;
};
