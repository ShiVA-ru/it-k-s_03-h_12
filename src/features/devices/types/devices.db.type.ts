import { randomUUID } from "node:crypto";

export class DeviceDb {
  public deviceId: string;

  constructor(
    public ip: string,
    public title: string,
    public iat: number,
    public expiresDate: string,
    public userId: string,
  ) {
    this.deviceId = randomUUID();
  }
}
