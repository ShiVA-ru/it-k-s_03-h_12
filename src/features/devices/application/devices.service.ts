import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import { inject, injectable } from "inversify";
import type { DeviceMeta } from "../../../core/types/device-meta.types.js";
import { ResultStatus } from "../../../core/types/result.code.js";
import type { Result } from "../../../core/types/result.type.js";
import { DeviceModel } from "../domain/device.entity.js";
import { DevicesRepository } from "../repositories/devices.repository.js";
import type { DeviceDb } from "../types/devices.db.type.js";

@injectable()
export class DevicesService {
	constructor(
		@inject(DevicesRepository)
		protected devicesRepository: DevicesRepository,
	) {}

	async create(
		dto: DeviceMeta & { userId: string },
		iat: number,
	): Promise<Result<{ insertedId: string } | null>> {
		const { ip, userAgent, userId } = dto;
		const deviceId = randomUUID();

		const device = new DeviceModel();

		device.ip = ip;
		device.title = userAgent;
		device.iat = iat;
		device.expiresDate = dayjs().add(1, "hour").toISOString();
		device.userId = userId;
		device.deviceId = deviceId;

		const insertedId = await this.devicesRepository.save(device);

		if (!insertedId) {
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "Credentials is not correct",
				extensions: [],
				data: null,
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: { insertedId: deviceId },
		};
	}

	async findById(deviceId: string, iat: number): Promise<DeviceDb | null> {
		return await this.devicesRepository.findOneById(deviceId, iat);
	}

	async findByDeviceId(deviceId: string): Promise<DeviceDb | null> {
		return await this.devicesRepository.findByDeviceId(deviceId);
	}

	async deleteOneById(deviceId: string, userId: string): Promise<boolean> {
		return await this.devicesRepository.deleteOneById(deviceId, userId);
	}

	async deleteOther(userId: string, deviceId: string): Promise<boolean> {
		return await this.devicesRepository.deleteOther(userId, deviceId);
	}
}
