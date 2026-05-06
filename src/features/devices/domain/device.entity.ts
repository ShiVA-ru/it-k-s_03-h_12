import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";
import { ObjectId } from "mongodb";
import { CreateDeviceDto } from "../types/device.dto.js";
import dayjs from "dayjs";

export type Device = {
	_id: ObjectId;
	ip: string;
	title: string;
	iat: number;
	expiresDate: string;
	userId: string;
	deviceId: string;
};

interface DeviceMethods {
}

type DeviceStatic = typeof DeviceEntity;

type DeviceModel = Model<Device, {}, DeviceMethods> & DeviceStatic;

export type DeviceDocument = HydratedDocument<Device, DeviceMethods>;

const DeviceSchema = new mongoose.Schema<Device, DeviceModel, DeviceMethods>({
	ip: { type: String, required: true },
	title: { type: String, required: true },
	iat: { type: Number, required: true },
	expiresDate: { type: String, required: true },
	userId: { type: String, required: true },
	deviceId: { type: String, required: true },
});

class DeviceEntity {
	private constructor(
		public deviceId: string,
		public ip: string,
		public title: string,
		public iat: number,
		public userId: string,
	) {}

	static createDevice(dto: CreateDeviceDto) {
		const device = new DeviceModel();

		device.ip = dto.ip;
		device.title = dto.title;
		device.iat = dto.iat;
		device.expiresDate = dayjs().add(1, "hour").toISOString();
		device.userId = dto.userId;
		device.deviceId = dto.deviceId;

		return device;
	}
}

DeviceSchema.loadClass(DeviceEntity);

export const DeviceModel = model<Device, DeviceModel>("Device", DeviceSchema);
