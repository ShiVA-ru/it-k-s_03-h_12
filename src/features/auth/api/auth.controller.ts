import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware.js";
import type { validationErrorsDto } from "../../../core/types/errors.types.js";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";
import type { IdType } from "../../../core/types/id.types.js";
import type {
	RequestWithBody,
	RequestWithUserId,
} from "../../../core/types/request.types.js";
import { resultCodeToHttpException } from "../../../core/utils/result-code-to-http-exception.js";
import { isSuccessResult } from "../../../core/utils/type-guards.js";
import { DevicesService } from "../../devices/application/devices.service.js";
import { UsersQueryRepository } from "../../users/infra/users.query.repository.js";
import type { UserInput } from "../../users/types/users.input.type.js";
import { RegistrationService } from "../application/auth.registration.service.js";
import { AuthService } from "../application/auth.service.js";
import type { RegistrationConfirmationCode } from "../types/confirmation.input.type.js";
import type { RegistrationEmail } from "../types/email.input.type.js";
import type { LoginInput } from "../types/login.input.type.js";
import type { MeView } from "../types/me.view.type.js";
import type { PasswordRecoveryInput } from "../types/new-pass.input.type.js";

@injectable()
export class AuthController {
	constructor(
		@inject(UsersQueryRepository)
		private usersQueryRepository: UsersQueryRepository,
		@inject(DevicesService)
		private devicesService: DevicesService,
		@inject(RegistrationService)
		private registrationService: RegistrationService,
		@inject(AuthService)
		private authService: AuthService,
	) {}

	async login(req: RequestWithBody<LoginInput>, res: Response) {
		try {
			const { loginOrEmail, password } = req.body;
			console.log("req.deviceMeta", req.deviceMeta);

			const result = await this.authService.loginUser(
				loginOrEmail,
				password,
				req.deviceMeta,
			);

			if (!isSuccessResult(result)) {
				return res.sendStatus(HttpStatus.Unauthorized);
			}
			res.cookie("refreshToken", result.data.refreshToken, {
				httpOnly: true,
				secure: true,
			});
			return res
				.status(HttpStatus.Ok)
				.json({ accessToken: result.data.accessToken });
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async logout(req: Request, res: Response) {
		try {
			const { userId, deviceId, iat } = req.refreshTokenPayload;

			if (!userId || !deviceId) {
				return res.sendStatus(HttpStatus.Unauthorized);
			}

			const isSessionExist = await this.devicesService.findById(deviceId, iat);

			if (!isSessionExist) {
				return res.sendStatus(HttpStatus.Unauthorized);
			}

			const result = await this.authService.logoutByDevice(userId, deviceId);

			if (!isSuccessResult(result)) {
				return res.sendStatus(HttpStatus.Unauthorized);
			}

			res.clearCookie("refreshToken");

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async refreshToken(req: RequestWithUserId<IdType>, res: Response) {
		try {
			const { userId, deviceId, iat } = req.refreshTokenPayload;

			if (!userId || !deviceId) {
				return res.sendStatus(HttpStatus.Unauthorized);
			}

			const isSessionExist = await this.devicesService.findById(deviceId, iat);

			if (!isSessionExist) {
				return res.sendStatus(HttpStatus.Unauthorized);
			}

			const result = await this.authService.updateTokens(userId, deviceId);

			if (!isSuccessResult(result)) {
				return res.sendStatus(HttpStatus.Unauthorized);
			}

			res.cookie("refreshToken", result.data.refreshToken, {
				httpOnly: true,
				secure: true,
			});

			return res
				.status(HttpStatus.Ok)
				.json({ accessToken: result.data.accessToken });
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async getMe(
		req: RequestWithUserId<IdType>,
		res: Response<MeView | validationErrorsDto>,
	) {
		try {
			const userId = req.userId;

			if (!userId) {
				res.sendStatus(HttpStatus.Unauthorized);
				return;
			}

			const findEntity = await this.usersQueryRepository.findMeById(userId);

			if (!findEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			res.status(HttpStatus.Ok).json(findEntity);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async registration(req: RequestWithBody<UserInput>, res: Response) {
		try {
			const result = await this.registrationService.registration(req.body);
			console.log("result", result);

			if (!isSuccessResult(result)) {
				return res
					.status(resultCodeToHttpException(result.status))
					.send(createErrorMessages(result.extensions));
			}

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			return res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async registrationConfirmation(
		req: RequestWithBody<RegistrationConfirmationCode>,
		res: Response,
	) {
		try {
			const result = await this.registrationService.confirmEmail(req.body);

			if (!isSuccessResult(result)) {
				return res
					.status(resultCodeToHttpException(result.status))
					.send(createErrorMessages(result.extensions));
			}

			res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async registrationEmailResending(
		req: RequestWithBody<RegistrationEmail>,
		res: Response,
	) {
		try {
			console.log('POST -> "auth/registration-email-resending', req.body);
			const result = await this.registrationService.emailResending(req.body);

			if (!isSuccessResult(result)) {
				console.log('POST -> "auth/registration-email-resending error', result);
				return res
					.status(resultCodeToHttpException(result.status))
					.send(createErrorMessages(result.extensions));
			}
			console.log(
				'POST -> "auth/registration-email-resending succefull',
				result,
			);

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			return res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async passwordRecovery(
		req: RequestWithBody<RegistrationEmail>,
		res: Response,
	) {
		try {
			console.log('POST -> "auth/password-recovery', req.body);
			await this.registrationService.passwordRecovery(req.body);

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			return res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async updatePassword(
		req: RequestWithBody<PasswordRecoveryInput>,
		res: Response,
	) {
		try {
			console.log('POST -> "auth/new-password', req.body);
			const updatedEntity =
				await this.registrationService.updatePasswordWithRecoveryCode(req.body);

			if (!isSuccessResult(updatedEntity)) {
				console.log(
					'POST -> "auth/new-password',
					updatedEntity,
				);
				return res
					.status(resultCodeToHttpException(updatedEntity.status))
					.send(createErrorMessages(updatedEntity.extensions));
			}

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			return res.sendStatus(HttpStatus.InternalServerError);
		}
	}
}
