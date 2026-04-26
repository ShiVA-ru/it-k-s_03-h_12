import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import { inject, injectable } from "inversify";
import { ResultStatus } from "../../../core/types/result.code.js";
import type { Result } from "../../../core/types/result.type.js";
import { BcryptService } from "../../auth/application/bcrypt.service.js";
import { type UserDocument, UserModel } from "../domain/user.entity.js";
import { UsersRepository } from "../repositories/users.repository.js";
import type { UserInput } from "../types/users.input.type.js";

@injectable()
export class UsersService {
	constructor(
		@inject(UsersRepository)
		private usersRepository: UsersRepository,
		@inject(BcryptService)
		private bcryptService: BcryptService
	) {}

	async create(
		dto: UserInput,
		isAdmin: boolean = false,
	): Promise<Result<{ insertedId: string } | null>> {
		const { login, password, email } = dto;

		const passwordHash = await this.bcryptService.generateHash(password);
		const user = new UserModel(); //!TODO нужно ли указывать тип?

		user.login = login;
		user.email = email;
		user.password = passwordHash;
		user.isEmailConfirmed = isAdmin;
		if (!isAdmin) {
			user.confirmationCode = randomUUID();
			user.confirmationCodeExpirationDate = dayjs()
				.add(1, "hour")
				.toISOString();
		}

		const insertedId = await this.usersRepository.save(user);
		console.log("insertedId", insertedId);

		// const newEntity = new UserDb(login, email, passwordHash, isAdmin);

		// const insertedId = await this.usersRepository.create(newEntity);

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: { insertedId },
		};
	}

	async deleteOneById(id: string): Promise<boolean> {
		return await this.usersRepository.deleteOneById(id);
	}

	async findById(id: string): Promise<UserDocument | null> {
		return await this.usersRepository.findOneById(id);
	}
}
