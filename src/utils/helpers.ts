const movieTitleToId = (title: string) =>
  title.replace(/[^a-zA-Z0-9-_]+/g, "-").toLowerCase();

export { movieTitleToId };
