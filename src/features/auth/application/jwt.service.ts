import jwt from "jsonwebtoken";
import config from "../../../core/settings/config.js";
import { ResultStatus } from "../../../core/types/result.code.js";
import type { Result } from "../../../core/types/result.type.js";
import type { TokenPair } from "../types/token-pair.type.js";
import type {
	AccessTokenPayload,
	RefreshTokenPayload,
} from "../types/token-payload.type.js";
import {injectable} from "inversify";

@injectable()
export class JwtService {
	async generateTokens(
		userId: string,
		deviceId: string,
		iat: number,
	): Promise<Result<TokenPair | null>> {
		try {
			const accessToken = jwt.sign({ userId }, config.jwtPrivateKey, {
				expiresIn: +config.accessTokenExpireTime,
			});

			const refreshToken = jwt.sign(
				{ userId, deviceId, iat },
				config.jwtPrivateKey,
				{
					expiresIn: +config.refreshTokenExpireTime,
					// noTimestamp: true
				},
			);

			return {
				status: ResultStatus.Success,
				extensions: [],
				data: { accessToken, refreshToken },
			};
		} catch (error) {
			console.error(error);
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "Can't create token",
				extensions: [],
				data: null,
			};
		}
	}

	async verifyAccessToken(
		token: string,
	): Promise<Result<AccessTokenPayload | null>> {
		try {
			const verified = jwt.verify(
				token,
				config.jwtPrivateKey,
			) as AccessTokenPayload;

			return {
				status: ResultStatus.Success,
				extensions: [],
				data: verified,
			};
		} catch (error) {
			console.error(error);
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "Can't verify token",
				extensions: [],
				data: null,
			};
		}
	}

	async verifyRefreshToken(
		token: string,
	): Promise<Result<RefreshTokenPayload | null>> {
		try {
			const verified = jwt.verify(
				token,
				config.jwtPrivateKey,
			) as RefreshTokenPayload;

			return {
				status: ResultStatus.Success,
				extensions: [],
				data: verified,
			};
		} catch (error) {
			console.error(error);
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "Can't verify token",
				extensions: [],
				data: null,
			};
		}
	}
}
