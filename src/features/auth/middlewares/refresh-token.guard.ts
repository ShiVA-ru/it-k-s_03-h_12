import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";
import { isSuccessResult } from "../../../core/utils/type-guards.js";
import {JwtService} from "../application/jwt.service.js";
import {container} from "../../../composition-root.js";
import {UsersService} from "../../users/application/users.service.js";

const usersService = container.get(UsersService);

export const refreshTokenGuardMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.cookies.refreshToken;
	const jwtService = container.get(JwtService);

	if (!token) {
		return res.sendStatus(HttpStatus.Unauthorized);
	}

	const verifyResult = await jwtService.verifyRefreshToken(token);

	if (!isSuccessResult(verifyResult)) {
		return res.sendStatus(HttpStatus.Unauthorized);
	}

	const userId = verifyResult.data.userId;
	const deviceId = verifyResult.data.deviceId;
	const iat = verifyResult.data.iat;

	const userEntity = await usersService.findById(userId);

	if (!userEntity) {
	  return res.sendStatus(HttpStatus.Unauthorized);
	}

	req.refreshTokenPayload = {
		userId,
		deviceId,
		iat,
	};
	next();
};
