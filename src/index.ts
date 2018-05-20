import * as _ from "lodash";
import { BaseCrawler } from "./crawlers";
import { Names } from "./consts";

const crawlers: BaseCrawler[] = [];

const addCrawler = (crawler: BaseCrawler) => {
  crawlers.push(crawler);
};

const removeCrawler = (crawler: BaseCrawler) => {
  _.pull(crawlers, crawler);
};

const updateMangaDb = (): Promise<any> => {
  return new Promise(async resolve => {
    await Promise.all(
      crawlers.map(async crawler => await crawler.getMangaList(true))
    );
    resolve();
  });
};

const search = (title: string): Promise<any> => {
  return new Promise(async resolve => {
    const variousResults = await Promise.all(
      crawlers.map(async crawler => {
        const result = await crawler.searchManga(title);
        return result;
      })
    );
    const results = _.flatten(variousResults);
    const grouped = _(results)
      .groupBy(manga => getSourceFromLocation(manga.location))
      .map((value, key) => ({ source: key, mangas: value }))
      .value();

    resolve(grouped);
  });
};

const getMangaInfo = (location: string): Promise<any> => {
  return new Promise(async resolve => {
    const source = getSourceFromLocation(location);
    const crawler = <BaseCrawler>getCrawlerFromSource(source);
    const info = crawler.getMangaInfo(location);
    resolve(info);
  });
};

const getChapters = (location: string): Promise<any> => {
  return new Promise(async resolve => {
    const source = getSourceFromLocation(location);
    const crawler = <BaseCrawler>getCrawlerFromSource(source);
    const chapters = crawler.getChapters(location);
    resolve(chapters);
  });
};

const getPages = (location: string): Promise<any> => {
  return new Promise(async resolve => {
    const source = getSourceFromLocation(location);
    const crawler = <BaseCrawler>getCrawlerFromSource(source);
    const pages = crawler.getPages(location);
    resolve(pages);
  });
};

const getSourceFromLocation = (location: string) => {
  if (/mangareader\.net/.test(location)) {
    return Names.MangaReader;
  }
  if (/goodmanga\.net/.test(location)) {
    return Names.GoodManga;
  }
  return "";
};

const getCrawlerFromSource = (source: string) => {
  return crawlers.find(crawler => crawler.name == source);
};

export {
  addCrawler,
  removeCrawler,
  crawlers,
  updateMangaDb,
  search,
  getMangaInfo,
  getChapters,
  getPages,
};
