import { injectable } from "inversify";
import {
	type Device,
	type DeviceDocument,
	DeviceModel,
} from "../domain/device.entity.js";

@injectable()
export class DevicesRepository {
	async create(dto: Device): Promise<string> {
		const result = await DeviceModel.insertOne(dto);
		return result._id.toString();
	}

	async save(device: DeviceDocument): Promise<string> {
		const result = await device.save();
		return result._id.toString();
	}

	async update(deviceId: string, iat: number): Promise<boolean> {
		const updateResult = await DeviceModel.updateOne(
			{ deviceId },
			{
				$set: {
					iat,
				},
			},
		);

		if (updateResult.matchedCount < 1) {
			return false;
		}

		return true;
	}

	async deleteOther(userId: string, currentDeviceId: string): Promise<boolean> {
		const deleteResult = await DeviceModel.deleteMany({
			userId,
			deviceId: { $ne: currentDeviceId },
		});

		// if (deleteResult.deletedCount < 1) {
		// 	return false;
		// }

		return true;
	}

	async deleteOneById(deviceId: string, userId: string): Promise<boolean> {
		const deleteResult = await DeviceModel.deleteOne({
			deviceId,
			userId,
		});

		if (deleteResult.deletedCount < 1) {
			return false;
		}

		return true;
	}

	async findOneById(
		deviceId: string,
		iat: number,
	): Promise<DeviceDocument | null> {
		const item = await DeviceModel.findOne({ deviceId, iat });

		if (!item) {
			return null;
		}

		return item;
	}

	async findByDeviceId(deviceId: string): Promise<DeviceDocument | null> {
		const item = await DeviceModel.findOne({ deviceId });

		if (!item) {
			return null;
		}

		return item;
	}
}
