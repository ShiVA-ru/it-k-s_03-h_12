import mongoose from "mongoose";
import config from "../core/settings/config.js";

const mongooseConnectionString = `${config.mongoUrl}/${config.dbName}`;

export async function runDB(url: string) {
	try {
		await mongoose.connect(mongooseConnectionString);
		console.log("✅ Connected to the database");
	} catch (error) {
		console.error(error);
		await mongoose.disconnect();
		throw new Error(`❌ Database not connected: ${error}`);
	}
}

export async function closeDB() {
	try {
		await mongoose.disconnect();
		console.log("✅ Database connection closed");
	} catch (error) {
		console.error("❌ Error closing database:", error);
	}
}
