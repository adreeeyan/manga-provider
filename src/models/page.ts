export default class Page {
  public index: number = 0;
  public image: string = "";

  constructor(init?: Partial<Page>) {
    Object.assign(this, init);
  }
}
