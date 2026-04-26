export class BlogDb {
  public createdAt: string;
  public isMembership: boolean;

  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
  }
}
