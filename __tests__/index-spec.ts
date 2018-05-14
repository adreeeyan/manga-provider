import * as MangaProvider from "../src";
import { MangaReaderCrawler, GoodMangaCrawler } from "../src/crawlers";

let searchedMangas = [];
jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

describe("The crawler shoud work", () => {
  let mangaReaderCrawler = new MangaReaderCrawler();
  let goodMangaCrawler = new GoodMangaCrawler();

  test("It should be able to add crawlers", () => {
    MangaProvider.addCrawler(mangaReaderCrawler);
    expect(MangaProvider.crawlers.length).toBe(1);
    MangaProvider.addCrawler(goodMangaCrawler);
    expect(MangaProvider.crawlers.length).toBe(2);
  });

  test("It should be able to remove crawlers", () => {
    MangaProvider.removeCrawler(mangaReaderCrawler);
    expect(MangaProvider.crawlers.length).toBe(1);
    MangaProvider.removeCrawler(goodMangaCrawler);
    expect(MangaProvider.crawlers.length).toBe(0);

    MangaProvider.addCrawler(mangaReaderCrawler);
    MangaProvider.addCrawler(goodMangaCrawler);
  });

  test("It should be able to update the manga list", async () => {
    await MangaProvider.updateMangaDb();
    expect(MangaProvider.crawlers[0].isMangaListEmpty()).toBe(false);
    expect(MangaProvider.crawlers[1].isMangaListEmpty()).toBe(false);
  });

  describe("It should get the list of mangas", async () => {
    beforeAll(async done => {
      searchedMangas = await MangaProvider.search("One Piece");
      done();
    });
    test("It should get results from first crawler", async () => {
      expect(searchedMangas[0].mangas.length).toBeGreaterThan(0);
    });
    test("It should get results from second crawler", async () => {
      expect(searchedMangas[1].mangas.length).toBeGreaterThan(0);
    });
  });

  test("It should get the manga info", async () => {
    const manga = await MangaProvider.getMangaInfo(
      searchedMangas[0].mangas[0].location
    );
    expect(manga.title.toLowerCase()).toBe("one piece");
  });

  test("It should get the chapters list", async () => {
    const chapters = await MangaProvider.getChapters(
      searchedMangas[0].mangas[0].location
    );
    expect(chapters.length).toBeGreaterThan(0);
  });

  test("It should get the pages list", async () => {
    const chapters = await MangaProvider.getChapters(
      searchedMangas[0].mangas[0].location
    );
    const pages = await MangaProvider.getPages(chapters[0].location);
    expect(pages.length).toBeGreaterThan(0);
  });
});
