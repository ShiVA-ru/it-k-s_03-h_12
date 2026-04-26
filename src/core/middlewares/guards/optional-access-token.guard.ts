import type { NextFunction, Request, Response } from "express";
import {isSuccessResult} from "../../utils/type-guards.js";
import {jwtService} from "../../../features/auth/application/jwt.service.js";

export const optionalAccessTokenGuardMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
        const [_, token] = authHeader.split(" ");

        const result = await jwtService.verifyAccessToken(token);

        if (isSuccessResult(result))  {
            req.userId = result.data.userId;
        }
    }

    next();
};
