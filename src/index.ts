import { MangaReaderCrawler } from "./crawlers";

const main = async () => {
  const crawler = new MangaReaderCrawler();
  const mangas = await crawler.getMangaList();
  const searchedMangas = crawler.searchManga(mangas, 'One Piece');
  console.log(searchedMangas);
  const manga = await crawler.getMangaInfo(searchedMangas[0].location);
  console.log(manga);
  const chapters = await crawler.getChapters(
    searchedMangas[0].location
  );
  console.log(chapters);
  const pages = await crawler.getPages(chapters[0].location);
  console.log(pages);
};

main();
