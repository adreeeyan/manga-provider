import * as _ from 'lodash';
import Manga from '../models/manga';

export default abstract class BaseCrawler {
  mangaList: Manga[];

  constructor() {
    this.mangaList = [];
  }

  abstract getMangaList = (): Promise<any> => {
    throw new Error('You have to implement this method getMangaList!');
  };

  abstract getMangaInfo = (location: string): Promise<any> => {
    throw new Error('You have to implement this method getMangaInfo!');
  };

  abstract getChapters = (location: string): Promise<any> => {
    throw new Error('You have to implement this method getChapters!');
  };

  abstract getPages = (location: string): Promise<any> => {
    throw new Error('You have to implement this method getPages!');
  };

  public searchManga = (source: Manga[], title: string) => {
    return (
      source.filter(manga =>
        _.includes(manga.title.toLowerCase(), title.toLowerCase())
      ) || []
    );
  };
}
