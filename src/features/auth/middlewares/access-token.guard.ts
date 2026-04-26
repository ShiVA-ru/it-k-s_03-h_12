import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";
import { isSuccessResult } from "../../../core/utils/type-guards.js";
import { JwtService } from "../application/jwt.service.js";
import {container} from "../../../composition-root.js";

export const accessTokenGuardMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (!req.headers.authorization) {
		res.sendStatus(HttpStatus.Unauthorized);
		return;
	}

	const jwtService = container.get(JwtService);
	const [authType, token] = req.headers.authorization.split(" ");

	if (authType !== "Bearer") {
		res.sendStatus(HttpStatus.Unauthorized);
		return;
	}

	const result = await jwtService.verifyAccessToken(token);

	if (!isSuccessResult(result)) {
		res.sendStatus(HttpStatus.Unauthorized);
		return;
	}

	req.userId = result.data.userId;
	next();
};
