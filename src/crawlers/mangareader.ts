import BaseCrawler from "./base";
import * as _ from "lodash";
import * as xray from "x-ray";
import { Page } from "../models";
import { Names } from "../consts";

export default class MangaReaderCrawler extends BaseCrawler {
  constructor() {
    super(Names.MangaReader);

    this.retriever = xray({
      filters: {
        cover: (text: string) => {
          const id = text.substr(text.lastIndexOf("/") + 1);
          return `https://s5.mangareader.net/cover/${id}/${id}-l0.jpg`;
        },
        alternativeTitles: (text: string) => {
          return [text];
        },
        authors: (text: string) => {
          return [text];
        },
        chapter_title: (text: string) => {
          const matches = text.match(/a href.*?>(.*?)<\/a>\s*:\s*(.*)?/);
          if (matches == null) {
            return "";
          }
          return `${matches[1]} ${matches[2] ? matches[2] : ""}`.trim();
        },
      },
    });
  }

  _getMangaList(forcedUpdate: boolean = false): Promise<any> {
    return new Promise(async resolve => {
      this.retriever(
        "https://www.mangareader.net/alphabetical",
        "ul.series_alpha > li",
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
      this.retriever(location, "#wrapper_body", {
        title: ".aname",
        alternativeTitles:
          "#mangaproperties tr:nth-of-type(2) td:last-of-type | alternativeTitles",
        authors: "#mangaproperties tr:nth-of-type(5) td:last-of-type | authors",
        summary: "#readmangasum p",
        genres: ["#mangaproperties tr:nth-of-type(8) .genretags"],
        status: "#mangaproperties tr:nth-of-type(4) td:last-of-type",
        releaseDate: "#mangaproperties tr:nth-of-type(3) td:last-of-type",
        cover: "#mangaimg img@src"
      }).then((res: any) => {
        res["rating"] = 0;
        resolve(res);
      });
    });
  }

  _getChapters(location: string): Promise<any> {
    return new Promise(async resolve => {
      this.retriever(location, "#chapterlist", {
        chaptersTitle: [
          "tr:not(:nth-of-type(1)) td:first-of-type@html | chapter_title",
        ],
        chapters: ["tr:not(:nth-of-type(1)) td:first-of-type a@href"],
      }).then((res: any) => {
        const chapters = res.chapters.map((chapter: any, index: any) => {
          return {
            index: index + 1,
            title: res.chaptersTitle[index],
            location: chapter,
          };
        });
        resolve(chapters);
      });
    });
  }

  _getPages(location: string): Promise<any> {
    return new Promise(async resolve => {
      // get page 1 first, it contains the range of the pages
      this.retriever(location, "#container", {
        image: "#imgholder img@src",
      })
        .paginate("#navi .next a@href")
        .abort((result: string, nextUrl: string) => {
          // abort if reached next chapter
          return nextUrl.split("/").length == 5;
        })
        .then((res: any) => {
          const pages = _.flatten(
            res.map((part: any, index: number) => {
              return new Page({
                index: index + 1,
                image: part.image,
              });
            })
          );

          resolve(pages);
        });
    });
  }
}
