# MangaProvider

A library for retrieving manga information from various sites. The retrieved information includes the covers, chapters, pages and others that can be retrieved.

```js
// add the crawlers
MangaProvider.addCrawler(new MangaReaderCrawler());
MangaProvider.addCrawler(new GoodMangaCrawler());

// search
const results = await MangaProvider.search("One Piece");

// get info
const manga = await MangaProvider.getMangaInfo(results[0].mangas[0].location);

// get chapters
const chapters = await MangaProvider.getChapters(results[0].mangas[0].location);

// get pages
const pages = await MangaProvider.getPages(chapters[0].location);
```

## Table of Contents

* [Requirements](#requirements)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

## Requirements

MangaProvider requires the following to run:

* nodejs
* npm

## Usage

First, install it via npm.

```
npm install --save baruch-manga-provider
```

Then you can load the module into your code with a `require` call:

```js
const MangaProvider = require("baruch-manga-provider");
```

or you can use `import`:

```js
import MangaProvider from "baruch-manga-provider";
```

### Output format

Some output listed below are in `Promise`. Thus, you need to use `.then` to get the actual output or you can `await` it.

#### `.then`

```js
MangaProvider.search("One piece").then(res => {
  console.log(res);
});
```

#### `.await`

```js
const res = await MangaProvider.search("One piece");
console.log(res);
```

### Adding a source `MangaProvider.addCrawler( crawler )`

By default there is no source added. This is so that you can control where you want your information to come from.

> Note: Adding many sources will make the initial loading of the library slower, no other side effects other than that.

```js
const {
  MangaReaderCrawler,
  GoodMangaCrawler
} = require("baruch-manga-provider/lib/crawlers");
MangaProvider.addCrawler(new MangaReaderCrawler());
MangaProvider.addCrawler(new GoodMangaCrawler());
```

### Removing a source `MangaProvider.removeCrawler( crawler )`

```js
const { MangaReaderCrawler } = require("baruch-manga-provider/lib/crawlers");
const crawler = new MangaReaderCrawler();
MangaProvider.addCrawler(crawler);
MangaProvider.removeCrawler(crawler);
```

### Searching a manga `MangaProvider.search( title )`

Returns a list of manga with minimal information.
Output is wrapped in a `Promise`.

**Parameters**

| Name  | Type   | Description                 | Example     |
| ----- | ------ | --------------------------- | ----------- |
| title | string | Possible title of the manga | "One piece" |

Sample usage:

```js
MangaProvider.search("One piece").then(res => {
  console.log(res);
});
```

**Return value**

An array of these properties:

| Name   | Type             | Description               | Example                 |
| ------ | ---------------- | ------------------------- | ----------------------- |
| source | string           | Where the list comes from | "GoodManga"             |
| mangas | array of objects | List of manga             | See sample output below |

Sample output:

```js
[
    {
        source: "MangaReader",
        mangas: [
            {
                title: "One Piece",
                cover: "https://s5.mangareader.net/cover/one-piece/one-piece-l0.jpg",
                location: "https://www.mangareader.net/one-piece"
            }
            ...
        ]
    },
    {
        source: "GoodManga",
        mangas: [
            {
                title: "One Piece",
                cover: "http://www.goodmanga.net/images/series/large/5.jpg",
                location: "http://www.goodmanga.net/5/one_piece"
            },
            {
                title: "One Piece - Digital Colored Comics",
                cover: "http://www.goodmanga.net/images/series/large/10363.jpg",
                location: "http://www.goodmanga.net/10363/one-piece-digital-colored-comics"
            },
            ...
        ]
    },
]
```

### Get manga info `MangaProvider.getMangaInfo( location )`

Returns manga information.
Output is wrapped in a `Promise`.

**Parameters**

| Name     | Type   | Description          | Example                                |
| -------- | ------ | -------------------- | -------------------------------------- |
| location | string | The url of the manga | "http://www.goodmanga.net/5/one_piece" |

Sample usage:

```js
MangaProvider.getMangaInfo("http://www.goodmanga.net/5/one_piece").then(res => {
  console.log(res);
});
```

**Return value**

| Name              | Type             | Description                        | Example                           |
| ----------------- | ---------------- | ---------------------------------- | --------------------------------- |
| title             | string           | Manga title                        | "One Piece"                       |
| alternativeTitles | array of strings | Other titles (e.g. Japanese title) | ["Wan pisu"]                      |
| authors           | array of strings | Authors                            | ["Oda Eiichiro"]                  |
| summary           | string           | Summary                            | "A long long time ago..."         |
| genres            | array of strings | Genres                             | ["Action", "Adventure", "Comedy"] |
| status            | string           | Status                             | "Ongoing"                         |
| releaseDate       | string           | Date released (Mostly just year)   | "1997"                            |
| rating            | number           | Rating from 0 to 10                | 9                                 |

Sample output:

```javascript
 {
    title: "One Piece",
    alternativeTitles: [ "Onepiece" ],
    authors: [ "Oda Eiichiro" ],
    summary: 'Greatness, Glory, Gold. A Pirate Named Gold Roger also known as the Pirate King has conquered this all. He was executed with an unknown reason but before he died he had revealed his last word about The legendary Treasure named One Piece which was hidden in the Grand Line. 22 years after his Death, A Pirate named Monkey D. Luffy appeared and has onlyone Goal, To Become the Next "Pirate King" and Find The Treasure "One Piece". This Start The Never Ending Adventure. Monkey D. Luffy, inspired by his childhood hero "Red-Haired" Shanks, sets out on a journey to find the legendary treasure One Piece, to become the new Pirate King, and after eating the devil\"s fruit gains the power to do so. To accomplish this, he must reach the end of the most deadly and dangerous ocean: The Grand Line. But first he must find a crew. less',
    genres: [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Fantasy",
        "Martial Arts",
        "Mystery",
        "Shounen",
        "Supernatural" ],
    status: "Ongoing",
    releaseDate: "1997",
    rating: "9"
}
```

> Note: Other info might not be returned, some sites might not have the information needed.

### Get manga chapters `MangaProvider.getChapters( location )`

Returns the list of chapters.
Output is wrapped in a `Promise`.

**Parameters**

| Name     | Type   | Description          | Example                                |
| -------- | ------ | -------------------- | -------------------------------------- |
| location | string | The url of the manga | "http://www.goodmanga.net/5/one_piece" |

Sample usage:

```js
MangaProvider.getChapters("http://www.goodmanga.net/5/one_piece").then(res => {
  console.log(res);
});
```

**Return value**

An array of these properties:

| Name     | Type   | Description        | Example                                        |
| -------- | ------ | ------------------ | ---------------------------------------------- |
| index    | number | Chapter number     | 3                                              |
| title    | string | Chapter title      | "One Piece Chapter 900"                        |
| location | string | URL of the chapter | "http://www.goodmanga.net/one_piece/chapter/3" |

Sample output:

```javascript
[
  {
    title: "One Piece Chapter 904",
    location: "http://www.goodmanga.net/one_piece/chapter/904"
  },
  {
    title: "One Piece Chapter 903",
    location: "http://www.goodmanga.net/one_piece/chapter/903"
  },
  {
    title: "One Piece Chapter 902",
    location: "http://www.goodmanga.net/one_piece/chapter/902"
  }
];
```

### Get chapter pages `MangaProvider.getPages( location )`

Returns the list of pages in a manga chapter.
Output is wrapped in a `Promise`.

**Parameters**

| Name     | Type   | Description                  | Example                                          |
| -------- | ------ | ---------------------------- | ------------------------------------------------ |
| location | string | The url of the manga chapter | "http://www.goodmanga.net/one_piece/chapter/904" |

Sample usage:

```js
MangaProvider.getPages("http://www.goodmanga.net/one_piece/chapter/904").then(
  res => {
    console.log(res);
  }
);
```

**Return value**

An array of these properties:

| Name  | Type   | Description           | Example                                                     |
| ----- | ------ | --------------------- | ----------------------------------------------------------- |
| index | number | Page number           | 1                                                           |
| image | string | URL of the page image | "http://www.goodmanga.net/images/manga/one_piece/904/1.jpg" |

Sample output:

```javascript
[
  {
    index: 1,
    image: "http://www.goodmanga.net/images/manga/one_piece/904/1.jpg"
  },
  {
    index: 2,
    image: "http://www.goodmanga.net/images/manga/one_piece/904/2.jpg"
  },
  {
    index: 3,
    image: "http://www.goodmanga.net/images/manga/one_piece/904/3.jpg"
  },
  ...
];
```

## Contributing

To contribute to MangaProvider, clone this repo locally and commit your code on a separate branch. Please write tests for your code before opening a pull-request:

```
npm test
```

You can find more detail in our [contributing guide](CONTRIBUTING.md).

## License

MangaProvider is licensed under the [MIT](LICENSE) license.  
Copyright &copy; 2018, Adrian Dela Piedra
