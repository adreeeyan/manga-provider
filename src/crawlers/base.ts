import * as _ from "lodash";
import { Manga } from "../models";

export default abstract class BaseCrawler {
  retriever: any;
  mangaList: Manga[];

  constructor() {
    this.mangaList = [];
  }

  public getMangaList = (forcedUpdate: boolean = false): Promise<any> => {
    return new Promise(async resolve => {
      // check if value already cached and not a forced update
      if (this.mangaList.length > 0 && !forcedUpdate) {
        resolve(this.mangaList);
      }

      const list = await this._getMangaList();
      resolve(list);
    });
  };

  abstract _getMangaList(): Promise<any>;

  public getMangaInfo = (location: string): Promise<any> => {
    return new Promise(async resolve => {
      const info = await this._getMangaInfo(location);
      resolve(info);
    });
  };

  abstract _getMangaInfo(location: string): Promise<any>;

  public getChapters = (location: string): Promise<any> => {
    return new Promise(async resolve => {
      const chapters = await this._getChapters(location);
      // reverse the sorting
      resolve(chapters.reverse());
    });
  };

  abstract _getChapters(location: string): Promise<any>;

  public getPages = (location: string): Promise<any> => {
    return new Promise(async resolve => {
      const pages = await this._getPages(location);
      resolve(pages);
    });
  };

  abstract _getPages(location: string): Promise<any>;

  public searchManga = (title: string): Promise<any> => {
    return new Promise(async resolve => {
      let source = this.mangaList;
      if (source.length == 0) {
        source = await this._getMangaList();
      }
      const searched =
        source.filter(manga =>
          _.includes(manga.title.toLowerCase(), title.toLowerCase())
        ) || [];
      resolve(searched);
    });
  };
}
