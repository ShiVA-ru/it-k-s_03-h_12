import type { WithId } from "mongodb";
import type { DeviceDb } from "../../types/devices.db.type.js";
import type { DeviceView } from "../../types/devices.view.type.js";

export const mapEntityToViewModel = (
	dbEntity: WithId<DeviceDb>,
): DeviceView => ({
	ip: dbEntity.ip,
	title: dbEntity.title,
	lastActiveDate: new Date(dbEntity.iat).toISOString(),
	deviceId: dbEntity.deviceId,
});
