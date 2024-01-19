const movieTitleToId = (title: string, year: number) =>
  `${title.replace(/[^a-zA-Z0-9-_]+/g, "-").toLowerCase()}-${year}`.replace(
    /-+/g,
    "-"
  );
export { movieTitleToId };
