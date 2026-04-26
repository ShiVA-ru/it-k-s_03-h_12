import express from "express";
import config from "../../../src/core/settings/config.js";
import { closeDB, runDB } from "../../../src/db/mongo.js";
import { setupApp } from "../../../src/setup-app.js";
import { generateBasicAuthToken } from "./generate-admin-auth-token.js";
export const commonTestManager = {
    adminToken: generateBasicAuthToken(),
    async initApp() {
        const app = express();
        setupApp(app);
        await runDB(config.mongoUrl);
        return app;
    },
    async closeApp() {
        await closeDB();
    },
};
