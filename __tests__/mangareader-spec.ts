import { MangaReaderCrawler } from "../src/crawlers";
import * as _ from "lodash";

let crawler = new MangaReaderCrawler();
let mangas = [];
jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

describe("The MangaReader crawler should work", () => {
  beforeEach = () => {
    crawler = new MangaReaderCrawler();
  };

  test("It should get the list of mangas", async () => {
    mangas = await crawler.getMangaList();
    expect(mangas.length).toBeGreaterThan(0);
  });

  test("It should be able to search manga", async () => {
    const searchedMangas = await crawler.searchManga("One Piece");
    expect(searchedMangas.length).toBeGreaterThan(0);
  });

  test("It should get the manga info", async () => {
    const searchedMangas = await crawler.searchManga("One Piece");
    const manga = await crawler.getMangaInfo(searchedMangas[0].location);
    expect(manga.authors).toContain("Oda, Eiichiro");
  });

  describe("It should get the chapters list", async () => {
    let chapters = [];

    test("It should be able to get the chapters list", async () => {
      chapters = await crawler.getChapters(mangas[0].location);
      expect(chapters.length).toBeGreaterThan(0);
    });

    test("It should be sorted in increasing order", () => {
      const isSorted = _.every(chapters, (value, index, array) => {
        return index === 0 || array[index - 1].index <= value.index;
      });
      expect(isSorted).toBe(true);
    });
  });

  test("It should get the pages list", async () => {
    const chapters = await crawler.getChapters(mangas[0].location);
    const pages = await crawler.getPages(chapters[0].location);

    expect(pages.length).toBeGreaterThan(0);
  });
});
