/**
 * tests for devices repository
 *
 * Scenario:
 *  - create multiple device sessions for the same user
 *  - delete one session by deviceId + userId
 *  - verify the total number of sessions decreased by one
 */
import { container } from "../src/composition-root.js";
import config from "../src/core/settings/config.js";
import { closeDB, runDB } from "../src/db/mongo.js";
import { DeviceModel } from "../src/features/devices/domain/device.entity.js";
import { DevicesRepository } from "../src/features/devices/repositories/devices.repository.js";
describe("devices.repository", () => {
    const devicesRepositoryInstance = container.get(DevicesRepository);
    // const devicesRepositoryInstance = new DevicesRepository();
    beforeAll(async () => {
        // connect to test database
        await runDB(config.mongoUrl);
    });
    beforeEach(async () => {
        // ensure clean slate for devices collection
        await DeviceModel.deleteMany({});
    });
    afterAll(async () => {
        // close DB connection after tests
        await closeDB();
    });
    it("creates multiple sessions and deleting one by deviceId reduces the count", async () => {
        const userId = "test-user-1";
        // Prepare three device session DTOs
        const nowSec = Math.floor(Date.now() / 1000);
        const expiresIso = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // +1 hour
        const devices = [
            {
                ip: "192.0.2.1",
                title: "Device A",
                userId,
                deviceId: "device-a-1",
                iat: nowSec,
                expiresDate: expiresIso,
            },
            {
                ip: "192.0.2.2",
                title: "Device B",
                userId,
                deviceId: "device-b-2",
                iat: nowSec,
                expiresDate: expiresIso,
            },
            {
                ip: "192.0.2.3",
                title: "Device C",
                userId,
                deviceId: "device-c-3",
                iat: nowSec,
                expiresDate: expiresIso,
            },
        ];
        // Insert sessions via repository
        const inserted = [];
        for (const d of devices) {
            const res = await devicesRepositoryInstance.create(d);
            inserted.push(res);
        }
        // Ensure 3 sessions created
        const countAfterCreate = await DeviceModel.countDocuments({ userId });
        expect(countAfterCreate).toBe(3);
        // Delete one session by deviceId
        const deviceToDelete = "device-b-2";
        const deleted = await devicesRepositoryInstance.deleteOneById(deviceToDelete, userId);
        expect(deleted).toBe(true);
        // Now count should be decreased by one
        const countAfterDelete = await DeviceModel.countDocuments({ userId });
        expect(countAfterDelete).toBe(2);
        // Ensure the specific deviceId is not present anymore
        const remaining = await DeviceModel.find({ userId }).lean();
        const hasDeletedDevice = remaining.some((r) => r.deviceId === deviceToDelete);
        expect(hasDeletedDevice).toBe(false);
    });
});
