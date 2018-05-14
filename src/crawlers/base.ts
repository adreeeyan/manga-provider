import * as _ from "lodash";
import { Manga } from "../models";

export default abstract class BaseCrawler {
  public name: string;
  protected retriever: any;
  protected mangaList: Manga[] = [];

  constructor(name: string) {
    this.name = name;
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

  public getMangaInfo = (location: string): Promise<any> => {
    return new Promise(async resolve => {
      const info = await this._getMangaInfo(location);
      resolve(info);
    });
  };

  public getChapters = (location: string): Promise<any> => {
    return new Promise(async resolve => {
      const chapters = await this._getChapters(location);
      resolve(chapters);
    });
  };

  public getPages = (location: string): Promise<any> => {
    return new Promise(async resolve => {
      const pages = await this._getPages(location);
      resolve(pages);
    });
  };

  public searchManga = (title: string): Promise<any> => {
    return new Promise(async resolve => {
      let source = this.mangaList;
      if (source.length === 0) {
        source = await this._getMangaList();
      }
      const searched =
        source.filter(manga =>
          _.includes(manga.title.toLowerCase(), title.toLowerCase())
        ) || [];
      const addedSource = searched.map(s => ({
        ...s,
        source: this.name,
      }));
      resolve(addedSource);
    });
  };

  protected abstract _getMangaList(): Promise<any>;
  protected abstract _getMangaInfo(location: string): Promise<any>;
  protected abstract _getChapters(location: string): Promise<any>;
  protected abstract _getPages(location: string): Promise<any>;
}
