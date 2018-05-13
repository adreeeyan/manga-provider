import GoodMangaCrawler from "../src/crawlers/goodmanga";

let goodMangaCrawler = new GoodMangaCrawler();

beforeEach = () => {
  goodMangaCrawler = new GoodMangaCrawler();
};

test("It should get the list of mangas", async () => {
  const mangas = await goodMangaCrawler.getMangaList();
  expect(mangas).toBeTruthy();
}, 30000);

test("It should be able to search manga", async () => {
  const mangas = await goodMangaCrawler.getMangaList();
  const searchedMangas = goodMangaCrawler.searchManga(mangas, "One Piece");
  expect(searchedMangas).toBeTruthy();
}, 30000);

test("It should get the manga info", async () => {
  const mangas = await goodMangaCrawler.getMangaList();
  const manga = await goodMangaCrawler.getMangaInfo(mangas[0].location);
  expect(manga).toBeTruthy();
}, 30000);

test("It should get the chapters list", async () => {
  const mangas = await goodMangaCrawler.getMangaList();
  const chapters = await goodMangaCrawler.getChapters(mangas[0].location);

  expect(chapters).toBeTruthy();
}, 30000);

test("It should get the pages list", async () => {
  const mangas = await goodMangaCrawler.getMangaList();
  const chapters = await goodMangaCrawler.getChapters(mangas[0].location);
  const pages = await goodMangaCrawler.getPages(chapters[0].location);

  expect(pages).toBeTruthy();
}, 30000);