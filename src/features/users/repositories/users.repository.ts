import { injectable } from "inversify";
import { type UserDocument, UserModel } from "../domain/user.entity.js";
import type { UserDb } from "../types/users.db.type.js";

@injectable()
export class UsersRepository {
	async create(dto: UserDb): Promise<string> {
		const result = await UserModel.insertOne(dto);
		return result._id.toString();
	}

	async save(user: UserDocument): Promise<string> {
		const result = await user.save();
		return result._id.toString();
	}

	async deleteOneById(id: string): Promise<boolean> {
		const deleteResult = await UserModel.deleteOne({
			_id: id,
		});

		if (deleteResult.deletedCount < 1) {
			return false;
		}

		return true;
	}

	async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
		return UserModel.findOne({
			$or: [{ email: loginOrEmail }, { login: loginOrEmail }],
		});
	}

	async isExistByLoginOrEmail(
		login: string,
		email: string,
	): Promise<UserDocument | null> {
		return UserModel.findOne({
			$or: [{ login }, { email }],
		});
	}

	async isExistByLogin(login: string): Promise<boolean> {
		const result = await UserModel.exists({ login });
		return result !== null;
	}

	async isExistByEmail(email: string): Promise<UserDocument | null> {
		return UserModel.findOne({ email });
	}

	async findOneById(id: string): Promise<UserDocument | null> {
		const item = await UserModel.findOne({ _id: id });

		if (!item) {
			return null;
		}

		return item;
	}

	async findOneByConfirmationCode(code: string): Promise<UserDocument | null> {
		const user = await UserModel.findOne({ confirmationCode: code });

		if (!user) {
			return null;
		}

		return user;
	}

	async findOneByPasswordRecoveryCode(
		code: string,
	): Promise<UserDocument | null> {
		const user = await UserModel.findOne({ recoveryCode: code });

		return user ?? null;
	}
}
