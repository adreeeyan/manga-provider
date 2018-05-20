export default class Manga {
  public title: string = "";
  public alternativeTitles: string[] = [];
  public cover: string = "";
  public authors: string[] = [];
  public genres: string[] = [];
  public summary: string = "";
  public status: string = "";
  public releaseDate: string = "";
  public rating: number = 0;
  public location: string = "";

  constructor(init?: Partial<Manga>) {
    Object.assign(this, init);
  }
}
