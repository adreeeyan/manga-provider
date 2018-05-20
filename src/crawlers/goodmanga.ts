import BaseCrawler from "./base";
import * as _ from "lodash";
import * as xray from "x-ray";
import { Page } from "../models";
import { Names } from "../consts";

export default class GoodMangaCrawler extends BaseCrawler {
  constructor() {
    super(Names.GoodManga);

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
        alternativeTitles: (text: string) => {
          const full_titles = text.replace("\nAlternative Titles: ", "").trim();
          return full_titles.split(",");
        },
        authors: (text: string) => {
          const authors = text.replace("\nAuthors:\n", "").trim();
          return authors.split(",");
        },
        status: (text: string) => {
          const status = text.replace("\nStatus:\n", "").trim();
          return status;
        },
        releaseDate: (text: string) => {
          const status = text.replace("\nReleased:\n", "").trim();
          return status;
        },
        rating: (text: string) => {
          return parseInt(text);
        },
      },
    });
  }

  _getMangaList(forcedUpdate: boolean = false): Promise<any> {
    return new Promise(async resolve => {
      this.retriever(
        "http://www.goodmanga.net/manga-list",
        "#content table.series_index td",
        {
          titles: ["a"],
          covers: ["a@href | cover"],
          location: ["a@href"],
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
  }

  _getMangaInfo(location: string): Promise<any> {
    return new Promise(async resolve => {
      this.retriever(location, "#content", {
        title: ".right_col h1",
        alternativeTitles:
          "#series_details > div:first-of-type | alternativeTitles",
        authors: "#series_details > div:nth-of-type(2) | authors",
        summary: "#series_details #full_notes",
        genres: ["#series_details > div:nth-of-type(7) .red_box"],
        status: "#series_details > div:nth-of-type(4) | status",
        releaseDate: "#series_details > div:nth-of-type(5) | releaseDate",
        rating: "#series_details #rating_num | rating",
        cover: "#series_image@src"
      }).then((res: any) => {
        resolve(res);
      });
    });
  }

  _getChapters(location: string): Promise<any> {
    return new Promise(async resolve => {
      this.retriever(location, "#content", {
        chaptersTitle: ["#chapters ul > li a"],
        chapters: ["#chapters ul > li a@href"],
      })
        .paginate(".pagination li:last-of-type a@href")
        .then((res: any) => {
          const chapters = _.flatten(
            res.map((part: any) => {
              const reversedChaptersTitle = part.chaptersTitle.reverse();
              return part.chapters.reverse().map((chapter: any, index: any) => {
                return {
                  index: index + 1,
                  title: reversedChaptersTitle[index].trim(),
                  location: chapter,
                };
              });
            })
          );
          resolve(chapters.sort((a: any, b: any) => a.index - b.index));
        });
    });
  }

  _getPages(location: string): Promise<any> {
    return new Promise(async resolve => {
      // get page 1 first, it contains the range of the pages
      this.retriever(location, "#content", {
        count: ".page_select ~ span",
        image: "#manga_viewer img@src",
      }).then((res: any) => {
        const count = parseInt(res.count.replace("of ", "").trim());
        const pagesNum = _.range(1, count + 1);
        const pages: Page[] = pagesNum.map((page: number) => {
          return new Page({
            index: page,
            image: res.image.replace(/(\d)+.jpg/, `${page}.jpg`),
          });
        });
        resolve(pages);
      });
    });
  }
}
