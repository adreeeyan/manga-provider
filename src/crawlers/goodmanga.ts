import BaseCrawler from './base';
import * as _ from 'lodash';
import * as xray from 'x-ray';
import Page from '../models/page';

export default class GoodMangaCrawler extends BaseCrawler {
  constructor() {
    super();

    this.retriever = xray({
      filters: {
        cover: (text: string) => {
          const matches = text.match(/http:\/\/www\.goodmanga\.net\/(\d+)/);
          if (!matches) {
            return text;
          }
          const id = matches[1];
          return `http://www.goodmanga.net/images/series/large/${id}.jpg`;
        },
        alternative_titles: (text: string) => {
          const full_titles = text.replace('\nAlternative Titles: ', '').trim();
          return full_titles.split(',');
        },
        authors: (text: string) => {
          const authors = text.replace('\nAuthors:\n', '').trim();
          return authors.split(',');
        },
        status: (text: string) => {
          const status = text.replace('\nStatus:\n', '').trim();
          return status.split(',');
        },
        rating: (text: string) => {
          return parseInt(parseFloat(text) / 10 * 100 + '');
        },
      },
    });
  }

  getMangaList = (forcedUpdate: boolean = false): Promise<any> => {
    return new Promise(async resolve => {

      // check if value already cached and not a forced update
      if(this.mangaList.length > 0 && !forcedUpdate){
        resolve(this.mangaList);
      }

      this.retriever(
        'http://www.goodmanga.net/manga-list',
        '#content table.series_index td',
        {
          titles: ['a'],
          covers: ['a@href | cover'],
          location: ['a@href'],
        }
      ).then((res: any) => {
        // map the response
        const mapped = res.titles.map((title: any, index: any) => {
          return {
            title: title.trim(),
            cover: res.covers[index],
            location: res.location[index],
          };
        });
        this.mangaList = mapped;
        resolve(mapped);
      });
    });
  };

  getMangaInfo = (location: string): Promise<any> => {
    return new Promise(async resolve => {
      this.retriever(location, '#content', {
        title: '.right_col h1',
        alternative_titles:
          '#series_details > div:first-of-type | alternative_titles',
        authors: '#series_details > div:nth-of-type(2) | authors',
        summary: '#series_details #full_notes',
        genres: ['#series_details > div:nth-of-type(7) .red_box'],
        status: '#series_details > div:nth-of-type(4) | status',
        release_date: '#series_details > div:nth-of-type(5)',
        rating: '#series_details #rating_num',
      }).then((res: any) => {
        resolve(res);
      });
    });
  };

  getChapters = (location: string): Promise<any> => {
    return new Promise(async resolve => {
      this.retriever(location, '#content', {
        chaptersTitle: ['#chapters ul > li a'],
        chapters: ['#chapters ul > li a@href'],
      })
        .paginate('.pagination li:last-of-type a@href')
        .then((res: any) => {
          const chapters = _.flatten(
            res.map((part: any) => {
              return part.chapters.map((chapter: any, index: any) => {
                return {
                  title: res[0].chaptersTitle[index].trim(),
                  location: chapter,
                };
              });
            })
          );
          resolve(chapters.reverse());
        });
    });
  };

  getPages = (location: string): Promise<any> => {
    return new Promise(async resolve => {
      // get page 1 first, it contains the range of the pages
      this.retriever(location, '#content', {
        count: '.page_select ~ span',
        image: '#manga_viewer img@src',
      }).then((res: any) => {
        const count = parseInt(res.count.replace('of ', '').trim());
        const pagesNum = _.range(1, count + 1);
        const pages: Page[] = pagesNum.map((page: number) => {
          return new Page({
            image: res.image.replace(/(\d)+.jpg/, `${page}.jpg`),
          });
        });
        resolve(pages);
      });
    });
  };
}
