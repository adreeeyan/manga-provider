export default class Chapter {
  public title: string = "";
  public location: string = "";

  constructor(init?: Partial<Chapter>) {
    Object.assign(this, init);
  }
}
