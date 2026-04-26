import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class UserDb {
  public createdAt: string;
  public confirmationCode: string | null;
  public confirmationCodeExpirationDate: string | null;
  public recoveryCode?: string | null;
  public recoveryCodeExpirationDate?: string | null;

  constructor(
    public login: string,
    public email: string,
    public password: string,
    public isEmailConfirmed: boolean,
  ) {
    this.createdAt = new Date().toISOString();
    this.confirmationCode = this.isEmailConfirmed ? null : randomUUID();
    this.confirmationCodeExpirationDate = isEmailConfirmed
      ? null
      : dayjs().add(1, "hour").toISOString();
    this.recoveryCode = null;
    this.recoveryCodeExpirationDate = null;
  }
}
