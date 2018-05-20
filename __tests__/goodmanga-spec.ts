import { GoodMangaCrawler } from "../src/crawlers";
import * as _ from "lodash";

let crawler = new GoodMangaCrawler();
let mangas = [];
let searchedMangas = [];
jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

describe("The GoodManga crawler should work", () => {
  beforeEach = () => {
    crawler = new GoodMangaCrawler();
  };

  test("It should get the list of mangas", async () => {
    mangas = await crawler.getMangaList();
    expect(mangas.length).toBeGreaterThan(0);
  });

  test("It should be able to search manga", async () => {
    searchedMangas = await crawler.searchManga("One Piece");
    expect(searchedMangas.length).toBeGreaterThan(0);
  });

  describe("It should get the manga info", async () => {
    let manga = null;
    beforeAll(async done => {
      manga = await crawler.getMangaInfo(searchedMangas[0].location);
      done();
    });
    test("It should get the author", () => {
      expect(manga.authors).toContain("Oda Eiichiro");
    });
    test("It should get the other titles", () => {
      expect(manga.alternativeTitles.length).toBeGreaterThan(0);
    });
    test("It should get the cover", () => {
      expect(manga.cover.length).toBeGreaterThan(0);
    });
    test("It should get the rating", () => {
      expect(typeof manga.rating).toBe("number");
    });
    test("It should get the genres", () => {
      expect(manga.genres.length).toBeGreaterThan(0);
    });
    test("It should get the summary", () => {
      expect(manga.summary.length).toBeGreaterThan(0);
    });
    test("It should get the release date", () => {
      expect(manga.releaseDate.length).toBeGreaterThan(0);
    });
  });

  describe("It should get the chapters list", async () => {
    let chapters = [];

    test("It should be able to get the chapters list", async () => {
      chapters = await crawler.getChapters(searchedMangas[0].location);
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
