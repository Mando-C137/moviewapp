import axios from "axios";
import cheerio from "cheerio";

export type ScrapeResult = {
  imdbRating: number;
  imdbId: string;
};

const scrape = (
  imdbSite: { type: "top250" | "top1000" } | { type: "title"; id: string }
): Promise<ScrapeResult[]> => {
  switch (imdbSite.type) {
    case "top250":
      return scrapeTop250();
    case "top1000":
      return scrapeTop1000();
    case "title":
      return scrapeTitleSite(imdbSite.id);
  }
};

const scrapeTitleSite = (idPath: string) => {
  return scrapeSite({
    url: `https://www.imdb.com/title/${idPath}`,
    imdbIdSelector: undefined,
    imdbRatingSelector: "hero-rating-bar__aggregate-rating__score > span",
    imdbId: idPath,
  });
};

const scrapeTop250 = () => {
  return scrapeSite({
    url: "https://www.imdb.com/chart/top/?ref_=nv_mv_250",
    imdbRatingSelector:
      "ipc-rating-star ipc-rating-star--base ipc-rating-star--imdb",
    imdbIdSelector:
      "ipc-title ipc-title--base ipc-title--title ipc-title-link-no-icon ipc-title--on-textPrimary sc-43986a27-9 gaoUku cli-title > a",
  });
};

const scrapeTop1000 = async () => {
  const res: ScrapeResult[] = [];
  const base_url =
    "https://www.imdb.com/search/title/?groups=top_1000&sort=user_rating,desc&start=";
  for (let i = 1; i <= 951; i += 50) {
    const [newElements] = await Promise.all([
      scrapeSite({
        url: `${base_url}${i}& ref_=adv_nxt`,
        imdbRatingSelector: ".ratings-imdb-rating > strong",
        imdbIdSelector: ".lister-item-header > a",
      }),
      new Promise((res) => setTimeout(res, 1000)),
    ]);
    res.push(...newElements);
  }

  return res;
};

const scrapeSite = async ({
  url,
  imdbIdSelector,
  imdbRatingSelector,
  ...rest
}:
  | {
      url: string;
      imdbIdSelector?: string;
      imdbRatingSelector: string;
    }
  | {
      url: string;
      imdbIdSelector?: string;
      imdbRatingSelector: string;
      imdbId: string;
    }) => {
  const result: ScrapeResult[] = [];

  const imdbSite = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
    },
  });
  const $ = cheerio.load(imdbSite.data as string);

  const ratings = $(imdbRatingSelector);
  const aTags = imdbIdSelector !== undefined ? $(imdbIdSelector) : [];

  const ratingArr: number[] = [];
  for (const ele of ratings) {
    const rating = $(ele).text();
    ratingArr.push(Number(rating));
  }
  const idArr: string[] = [];
  for (const ele of aTags) {
    const imdb_id = $(ele).attr()["href"]?.split("/")[2];
    if (imdb_id) idArr.push(imdb_id);
  }

  for (let i = 0; i < idArr.length; i++) {
    const rating = ratingArr[i];
    const id = idArr[i];
    if (rating) {
      result.push({
        imdbId: id ?? (rest as { imbdbId: string }).imbdbId,
        imdbRating: rating,
      });
    }
  }
  return result;
};

export { scrape };
