import type { NextFunction, Request, Response } from "express";
import { RequestModel } from "../../../db/request.entity.js";
import config from "../../settings/config.js";
import { HttpStatus } from "../../types/http-statuses.types.js";

export const rateLimitGuardMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const requestIp = req.ip;
	// req.headers["x-forwarded-for"]as ||

	if (!requestIp) {
		throw new Error("now ip in request");
	}

	const requestPathname = req.originalUrl;

	const request = new RequestModel();

	request.ip = requestIp;
	request.url = req.originalUrl;

	await request.save();

	const requestCount = await RequestModel.countDocuments({
		$and: [
			{ ip: { $regex: requestIp, $options: "i" } },
			{ url: { $regex: requestPathname, $options: "i" } },
			{
				date: { $gte: new Date(Date.now() - +config.rateLimitInterval * 1000) },
			},
		],
	});

	if (requestCount > +config.rateLimitCount) {
		return res.sendStatus(HttpStatus.TooManyRequests);
	}

	next();
};
