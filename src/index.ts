import GoodMangaCrawler from './crawlers/goodmanga';

const main = async () => {
  const goodMangaCrawler = new GoodMangaCrawler();
  const mangas = await goodMangaCrawler.getMangaList();
  const searchedMangas = goodMangaCrawler.searchManga(mangas, 'One Piece');
  console.log(searchedMangas);
  const manga = await goodMangaCrawler.getMangaInfo(searchedMangas[0].location);
  console.log(manga);
  const chapters = await goodMangaCrawler.getChapters(
    searchedMangas[0].location
  );
  console.log(chapters);
  const pages = await goodMangaCrawler.getPages(chapters[0].location);
  console.log(pages);
};

main();
