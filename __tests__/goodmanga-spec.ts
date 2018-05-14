import { GoodMangaCrawler } from "../src/crawlers";

let goodMangaCrawler = new GoodMangaCrawler();
let mangas = [];

describe("The GoodManga crawler should work", () => {
  beforeEach = () => {
    goodMangaCrawler = new GoodMangaCrawler();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
  };

  test("It should get the list of mangas", async () => {
    mangas = await goodMangaCrawler.getMangaList();
    expect(mangas.length).toBeGreaterThan(0);
  });

  test("It should be able to search manga", async () => {
    const searchedMangas = goodMangaCrawler.searchManga(mangas, "One Piece");
    expect(searchedMangas.length).toBeGreaterThan(0);
  });

  test("It should get the manga info", async () => {
    const searchedMangas = goodMangaCrawler.searchManga(mangas, "One Piece");
    const manga = await goodMangaCrawler.getMangaInfo(
      searchedMangas[0].location
    );
    expect(manga.authors).toContain("Oda Eiichiro");
  });

  test("It should get the chapters list", async () => {
    const chapters = await goodMangaCrawler.getChapters(mangas[0].location);

    expect(chapters.length).toBeGreaterThan(0);
  });

  test("It should get the pages list", async () => {
    const chapters = await goodMangaCrawler.getChapters(mangas[0].location);
    const pages = await goodMangaCrawler.getPages(chapters[0].location);

    expect(pages.length).toBeGreaterThan(0);
  });
});
