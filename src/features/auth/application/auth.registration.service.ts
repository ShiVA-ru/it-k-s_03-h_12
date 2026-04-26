import {randomUUID} from "node:crypto";
import dayjs from "dayjs";
import {inject, injectable} from "inversify";
import {emailAdapter} from "../../../adapters/email.adapter.js";
import {ResultStatus} from "../../../core/types/result.code.js";
import type {Result} from "../../../core/types/result.type.js";
import {UsersService} from "../../users/application/users.service.js";
import {UsersRepository} from "../../users/repositories/users.repository.js";
import type {UserInput} from "../../users/types/users.input.type.js";
import type {RegistrationConfirmationCode} from "../types/confirmation.input.type.js";
import type {RegistrationEmail} from "../types/email.input.type.js";
import type {PasswordRecoveryInput} from "../types/new-pass.input.type.js";
import {bcryptService} from "./bcrypt.service.js";

@injectable()
export class RegistrationService {
	constructor(
		@inject(UsersRepository)
		private usersRepository: UsersRepository,
		@inject(UsersService)
		private usersService: UsersService,
	) {}

	async registration(dto: UserInput): Promise<Result<true>> {
		const { login, email } = dto;
		console.log(dto);

		const isUserExistByLogin = await this.usersRepository.isExistByLogin(login);

		if (isUserExistByLogin) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "Bad Request",
				data: null,
				extensions: [{ field: "login", message: "Already Registered" }],
			};
		}
		const isUserExistByEmail = await this.usersRepository.isExistByEmail(email);

		if (isUserExistByEmail) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "Bad Request",
				data: null,
				extensions: [{ field: "email", message: "Already Registered" }],
			};
		}
		console.log("user not exist");

		const result = await this.usersService.create(dto);
		console.log("user created", result.data?.insertedId);

		if (!result.data) {
			return {
				status: ResultStatus.InternalServerError,
				errorMessage: "InternalServerError",
				data: null,
				extensions: [],
			};
		}

		const createdEntity = await this.usersRepository.findOneById(
			result.data.insertedId,
		);

		if (!createdEntity) {
			return {
				status: ResultStatus.InternalServerError,
				errorMessage: "InternalServerError",
				data: null,
				extensions: [],
			};
		}

		console.log("userInfo", createdEntity);

		if (!createdEntity.isEmailConfirmed) {
			console.log("почта отправлена", createdEntity.isEmailConfirmed);
			emailAdapter
				.sendEmail(
					email,
					`<h1>Thank for your registration</h1>
         <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${createdEntity.confirmationCode}'>complete registration</a>
         </p>
         `,
				)
				.catch((e) => {
					console.error(e);
				});
		}
		console.log("confirmationCode", createdEntity.confirmationCode);
		console.log(
			"confirmationCodeExpirationDate",
			createdEntity.confirmationCodeExpirationDate,
		);

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: true,
		};
	}

	async confirmEmail(dto: RegistrationConfirmationCode): Promise<Result<true>> {
		const user = await this.usersRepository.findOneByConfirmationCode(dto.code);

		if (!user) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "Bad Request",
				data: null,
				extensions: [{ field: "code", message: "Code not found" }],
			};
		}

		if (user.isEmailConfirmed) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "User already confirmed",
				data: null,
				extensions: [{ field: "code", message: "Already confirmed" }],
			};
		}

		if (dayjs().isAfter(user.confirmationCodeExpirationDate)) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "Time is expired",
				data: null,
				extensions: [],
			};
		}

		// удаляем проверочный код с проверочной датой, устанавливаем emailConfirmed в true
		user.confirmationCode = null;
		user.confirmationCodeExpirationDate = null;
		user.isEmailConfirmed = true;

		const updatedResult = await this.usersRepository.save(user);

		if (!updatedResult) {
			return {
				status: ResultStatus.InternalServerError,
				errorMessage: "Bad Request",
				data: null,
				extensions: [{ field: "code", message: "Code not updated" }],
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: true,
		};
	}

	async emailResending(dto: RegistrationEmail): Promise<Result<true>> {
		const { email } = dto;
		console.log(dto);

		const user = await this.usersRepository.isExistByEmail(email);

		if (!user) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "Bad Request",
				data: null,
				extensions: [{ field: "email", message: "email does not exist" }],
			};
		}

		if (user.isEmailConfirmed) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "Bad Request",
				data: null,
				extensions: [{ field: "email", message: "email already confirmed" }],
			};
		}

		const newConfirmationCode = randomUUID().toString();
		const confirmationCodeExpirationDate = dayjs().add(1, "hour").toISOString();

		console.log("почта отправлена", user.isEmailConfirmed);
		emailAdapter
			.sendEmail(
				email,
				`<h1>Thank for your registration</h1>
         <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newConfirmationCode}'>complete registration</a>
         </p>
         `,
			)
			.catch((e) => {
				console.error(e);
			});

		user.confirmationCode = newConfirmationCode;
		user.confirmationCodeExpirationDate = confirmationCodeExpirationDate;

		const updatedResult = await this.usersRepository.save(user);

		if (!updatedResult) {
			return {
				status: ResultStatus.InternalServerError,
				errorMessage: "InternalServerError",
				data: null,
				extensions: [],
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: true,
		};
	}

	async passwordRecovery(dto: RegistrationEmail): Promise<undefined> {
		const { email } = dto;
		console.log(dto);

		const user = await this.usersRepository.isExistByEmail(email);

		if (!user) {
			return;
		}

		if (!user.isEmailConfirmed) {
			return;
		}

		const recoveryCode = randomUUID();
		const recoveryExpiration = dayjs().add(1, "hour").toISOString();

		// console.log("почта отправлена", user.isEmailConfirmed);
		emailAdapter
			.sendEmail(
				email,
				`<h1>Password recovery</h1>
         <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>
            recovery password
          </a>
        </p>
        `,
			)
			.catch((e) => {
				console.error(e);
			});

		user.recoveryCode = recoveryCode;
		user.recoveryCodeExpirationDate = recoveryExpiration;

		await this.usersRepository.save(user);

		return;
	}

	async updatePasswordWithRecoveryCode(
		dto: PasswordRecoveryInput,
	): Promise<Result<true>> {
		const { newPassword, recoveryCode } = dto;

		const user =
			await this.usersRepository.findOneByPasswordRecoveryCode(recoveryCode);

		if (!user) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "Bad request",
				data: null,
				extensions: [
					{ field: "recoveryCode", message: "Invalid recovery code " },
				],
			};
		}

		if (dayjs().isAfter(user.recoveryCodeExpirationDate)) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "Recovery code expired",
				data: null,
				extensions: [{ field: "recoveryCode", message: "Recovery code is expired" }],
			};
		}

		user.password = await bcryptService.generateHash(newPassword);
		user.recoveryCode = null;
		user.recoveryCodeExpirationDate = null;

		const isPasswordUpdate = await this.usersRepository.save(user);

		if (!isPasswordUpdate) {
			return {
				status: ResultStatus.BadRequest,
				errorMessage: "Bad request",
				data: null,
				extensions: [],
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: true,
		};
	}
}
