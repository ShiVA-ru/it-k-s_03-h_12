export class CreateDeviceDto {
    constructor(
        public ip: string,
        public title: string,
        public iat: number,
        public deviceId: string,
        public userId: string,
    ) {}
}