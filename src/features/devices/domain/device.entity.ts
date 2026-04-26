import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";

export type Device = {
	ip: string;
	title: string;
	iat: number;
	expiresDate: string;
	userId: string;
	deviceId: string;
};

type DeviceModel = Model<Device>;

export type DeviceDocument = HydratedDocument<Device>;

const DeviceSchema = new mongoose.Schema<Device>({
	ip: { type: String, required: true },
	title: { type: String, required: true },
	iat: { type: Number, required: true },
	expiresDate: { type: String, required: true },
	userId: { type: String, required: true },
	deviceId: { type: String, required: true },
});

export const DeviceModel = model<Device, DeviceModel>("Device", DeviceSchema);
