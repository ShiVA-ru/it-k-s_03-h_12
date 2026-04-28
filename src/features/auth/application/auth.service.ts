import { inject, injectable } from "inversify";
import type { DeviceMeta } from "../../../core/types/device-meta.types.js";
import { ResultStatus } from "../../../core/types/result.code.js";
import type { Result } from "../../../core/types/result.type.js";
import { isSuccessResult } from "../../../core/utils/type-guards.js";
import { DevicesService } from "../../devices/application/devices.service.js";
import { DevicesRepository } from "../../devices/infra/devices.repository.js";
import { mapEntityToViewModel } from "../../users/infra/mappers/users.entity-map.js";
import { UsersRepository } from "../../users/infra/users.repository.js";
import type { UserView } from "../../users/types/users.view.type.js";
import type { TokenPair } from "../types/token-pair.type.js";
import { BcryptService } from "./bcrypt.service.js";
import { JwtService } from "./jwt.service.js";

@injectable()
export class AuthService {
	constructor(
		@inject(DevicesRepository)
		private devicesRepository: DevicesRepository,
		@inject(UsersRepository)
		private usersRepository: UsersRepository,
		@inject(DevicesService)
		private devicesService: DevicesService,
		@inject(BcryptService)
		private bcryptService: BcryptService,
		@inject(JwtService)
		private jwtService: JwtService,
	) {}

	async loginUser(
		loginOrEmail: string,
		password: string,
		deviceMeta: DeviceMeta,
	): Promise<Result<TokenPair | null>> {
		const now = Math.floor(Date.now() / 1000);

		const userCredentialsResult = await this.checkUserCredentials(
			loginOrEmail,
			password,
		);

		if (!isSuccessResult(userCredentialsResult)) {
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "Credentials is not correct",
				extensions: [],
				data: null,
			};
		}
		const userId = userCredentialsResult.data.id;

		const createSessionResult = await this.devicesService.create(
			{
				...deviceMeta,
				userId,
			},
			now,
		);

		if (!isSuccessResult(createSessionResult)) {
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "Credentials is not correct",
				extensions: [],
				data: null,
			};
		}

		const deviceId = createSessionResult.data.insertedId;

		const tokensResult = await this.jwtService.generateTokens(userId, deviceId, now);

		if (!isSuccessResult(tokensResult)) {
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "Can't create jwt token",
				extensions: [],
				data: null,
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: {
				accessToken: tokensResult.data.accessToken,
				refreshToken: tokensResult.data.refreshToken,
			},
		};
	}

	async logoutByDevice(
		userId: string,
		deviceId: string,
	): Promise<Result<true | null>> {
		const isDeleted = await this.devicesRepository.deleteOneById(
			deviceId,
			userId,
		);

		if (!isDeleted) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "Device not found",
				extensions: [],
				data: null,
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: true,
		};
	}

	async checkUserCredentials(
		loginOrEmail: string,
		password: string,
	): Promise<Result<UserView | null>> {
		const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
		if (!user)
			return {
				status: ResultStatus.NotFound,
				errorMessage: "User with this credentials is not found",
				extensions: [],
				data: null,
			};

		const checkPassword = await this.bcryptService.checkPassword(
			password,
			user.password,
		);

		if (!checkPassword) {
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "User password is not correct",
				extensions: [],
				data: null,
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: mapEntityToViewModel(user),
		};
	}

	async updateTokens(
		userId: string,
		deviceId: string,
	): Promise<Result<TokenPair | null>> {
		const now = Math.floor(Date.now() / 1000);

		const isUpdated = await this.devicesRepository.update(deviceId, now);

		if (!isUpdated) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "Device not found",
				extensions: [],
				data: null,
			};
		}

		const tokensResult = await this.jwtService.generateTokens(userId, deviceId, now);

		if (!isSuccessResult(tokensResult)) {
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "Can't create jwt token",
				extensions: [],
				data: null,
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: {
				accessToken: tokensResult.data.accessToken,
				refreshToken: tokensResult.data.refreshToken,
			},
		};
	}
}
