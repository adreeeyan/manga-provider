export default class Page {
  public image: string = '';

  constructor(init?: Partial<Page>) {
    Object.assign(this, init);
  }
}
