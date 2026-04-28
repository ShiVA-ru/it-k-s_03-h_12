import { injectable } from "inversify";
import { DeviceModel } from "../domain/device.entity.js";
import type { DeviceView } from "../types/devices.view.type.js";
import { mapEntityToViewModel } from "./mappers/users.entity-map.js";

@injectable()
export class DevicesQueryRepository {
	async findAll(userId: string): Promise<DeviceView[]> {
		const items = await DeviceModel.find({ userId }).lean();

		return items.map(mapEntityToViewModel);
	}
}
