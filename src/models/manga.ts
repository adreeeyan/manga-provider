export default class Manga {
  public title: string = "";
  public alternative_titles: string[] = [];
  public authors: string[] = [];
  public genres: string[] = [];
  public summary: string = "";
  public status: string = "";
  public release_date: string = "";
  public rating: number = 0;
  public location: string = "";

  constructor(init?: Partial<Manga>) {
    Object.assign(this, init);
  }
}
