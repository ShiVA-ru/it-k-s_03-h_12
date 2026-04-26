import request from "supertest";
import { RouterPath } from "../../../src/core/constants/router.constants.js";
import { HttpStatus } from "../../../src/core/types/http-statuses.types.js";
import { commonTestManager } from "../utils/common.test-manager.js";
describe("E2E: device sessions - create multiple and delete one", () => {
    let app;
    const user = {
        login: "devuser",
        password: "Password1",
        email: "devuser@example.com",
    };
    beforeAll(async () => {
        app = await commonTestManager.initApp();
        // clean all collections
        await request(app).delete(`${RouterPath.testing}/all-data`);
    });
    afterAll(async () => {
        await commonTestManager.closeApp();
    });
    it("should create several sessions by logging in multiple times and delete one by id", async () => {
        // register user
        await request(app)
            .post(`${RouterPath.auth}/registration`)
            .send(user)
            .expect(HttpStatus.NoContent);
        const agent = request.agent(app);
        // login 3 times with different User-Agent to emulate different devices
        const userAgents = ["Device-Agent-1", "Device-Agent-2", "Device-Agent-3"];
        let refreshCookie;
        for (const ua of userAgents) {
            const loginRes = await agent
                .post(`${RouterPath.auth}/login`)
                .set("User-Agent", ua)
                .send({ loginOrEmail: user.login, password: user.password })
                .expect(HttpStatus.Ok);
            // headers["set-cookie"] can be string or string[] depending on environment (Node/agent).
            // Normalize it to a string[] safely to satisfy TypeScript and runtime variability.
            const rawSetCookie = loginRes.headers["set-cookie"];
            const setCookieArr = Array.isArray(rawSetCookie)
                ? rawSetCookie
                : rawSetCookie
                    ? [rawSetCookie]
                    : undefined;
            if (setCookieArr && setCookieArr.length > 0) {
                // take cookie values (without options) and build header
                refreshCookie = setCookieArr.map((c) => c.split(";")[0]).join("; ");
            }
        }
        // get list of active sessions (send refresh token cookie)
        const res1 = await request(app)
            .get(RouterPath.devices)
            .set("Cookie", refreshCookie ?? "")
            .expect(HttpStatus.Ok);
        const sessions = res1.body;
        expect(Array.isArray(sessions)).toBe(true);
        expect(sessions.length).toBe(3);
        // Validate that each expected device session exists and has correct fields (title, ip, lastActiveDate)
        const expectAgentSession = (agentName) => {
            const s = sessions.find((x) => x.title === agentName);
            expect(s).toBeDefined();
            // ip should be a non-empty string
            expect(typeof s.ip).toBe("string");
            expect(s.ip.length).toBeGreaterThan(0);
            // lastActiveDate should be a valid ISO date string
            expect(typeof s.lastActiveDate).toBe("string");
            expect(!Number.isNaN(Date.parse(s.lastActiveDate))).toBe(true);
            // deviceId must be present
            expect(typeof s.deviceId).toBe("string");
            expect(s.deviceId.length).toBeGreaterThan(0);
        };
        expectAgentSession("Device-Agent-1");
        expectAgentSession("Device-Agent-2");
        expectAgentSession("Device-Agent-3");
        // pick one device to delete (use the second session found in the original array)
        const deviceToDelete = sessions[1].deviceId;
        const deletedTitle = sessions[1].title;
        // delete by id (send refresh token cookie)
        await request(app)
            .delete(`${RouterPath.devices}/${deviceToDelete}`)
            .set("Cookie", refreshCookie ?? "")
            .expect(HttpStatus.NoContent);
        // get list again
        const res2 = await request(app)
            .get(RouterPath.devices)
            .set("Cookie", refreshCookie ?? "")
            .expect(HttpStatus.Ok);
        const sessionsAfterDelete = res2.body;
        expect(sessionsAfterDelete.length).toBe(2);
        // ensure deleted device is absent by deviceId
        const exists = sessionsAfterDelete.some((s) => s.deviceId === deviceToDelete);
        expect(exists).toBe(false);
        // ensure deleted device title is absent and remaining sessions still have valid fields
        const titleExists = sessionsAfterDelete.some((s) => s.title === deletedTitle);
        expect(titleExists).toBe(false);
        // validate remaining sessions structure
        sessionsAfterDelete.forEach((s) => {
            expect(typeof s.title).toBe("string");
            expect(s.title.length).toBeGreaterThan(0);
            expect(typeof s.ip).toBe("string");
            expect(s.ip.length).toBeGreaterThan(0);
            expect(typeof s.lastActiveDate).toBe("string");
            expect(!Number.isNaN(Date.parse(s.lastActiveDate))).toBe(true);
            expect(typeof s.deviceId).toBe("string");
            expect(s.deviceId.length).toBeGreaterThan(0);
        });
    });
});
