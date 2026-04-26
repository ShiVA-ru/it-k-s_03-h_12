import type { NextFunction, Request, Response } from "express";
import config from "../../../core/settings/config.js";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";

export const superAdminGuardMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const auth = req.headers["authorization"] as string;
	if (!auth) {
		res.sendStatus(HttpStatus.Unauthorized);
		return;
	}

	const [authType, token] = auth.split(" ");
	if (authType !== "Basic") {
		res.sendStatus(HttpStatus.Unauthorized);
		return;
	}

	const credentials = Buffer.from(token, "base64").toString("utf-8");
	const [username, password] = credentials.split(":");

	if (username !== config.adminUsername || password !== config.adminPassword) {
		res.sendStatus(HttpStatus.Unauthorized);
		return;
	}

	next();
};
