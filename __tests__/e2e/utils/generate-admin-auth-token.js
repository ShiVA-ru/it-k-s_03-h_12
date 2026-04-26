import config from "../../../src/core/settings/config.js";
export function generateBasicAuthToken() {
    const credentials = `${config.adminUsername}:${config.adminPassword}`;
    const token = Buffer.from(credentials).toString("base64");
    return `Basic ${token}`;
}
