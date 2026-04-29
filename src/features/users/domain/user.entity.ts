import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";
import {CreateUserDto} from "./dto.js";
import {randomUUID} from "node:crypto";
import dayjs from "dayjs";

export type User = {
	login: string;
	email: string;
	password: string;
	isEmailConfirmed: boolean;
	createdAt: Date;
	confirmationCode: string | null;
	confirmationCodeExpirationDate: string | null;
	recoveryCode?: string | null;
	recoveryCodeExpirationDate?: string | null;
};

interface UserMethods {}

type UserStatic = typeof UserEntity;

type UserModel = Model<User, {}, UserMethods> & UserStatic;

export type UserDocument = HydratedDocument<User, UserMethods>;

const UserSchema = new mongoose.Schema<User, UserModel, UserMethods>({
	login: { type: String, trim: true, required: true }, //!TODO добавить unique: true
	email: { type: String, trim: true, required: true }, //!TODO добавить unique: true
	password: { type: String, trim: true, required: true },
	isEmailConfirmed: { type: Boolean, default: false },
	confirmationCode: { type: String, default: null },
	confirmationCodeExpirationDate: { type: String, default: null },
	recoveryCode: { type: String, default: null },
	recoveryCodeExpirationDate: { type: String, default: null },
}, {
	timestamps: true,
});

class UserEntity {
	private constructor(
		public login: string,
		public email: string,
		public password: string,
		public isEmailConfirmed: boolean = false,
		public confirmationCode: string | null = null,
		public confirmationCodeExpirationDate: string | null = null,
		public recoveryCode: string | null = null,
		public recoveryCodeExpirationDate: string | null = null,
	) {
		console.log(`=========I'm not working here=============`);
	}

	static createUser (dto: CreateUserDto, isAdmin: boolean) {
		const user = new UserModel(dto);
		// if user created by admin set to true using isAdmin parameter
		user.isEmailConfirmed = isAdmin;

		if (!isAdmin) {
			user.confirmationCode = randomUUID();
			user.confirmationCodeExpirationDate = dayjs().add(1, "hour").toISOString();
		}

		// const user = new UserModel();
		// user.login = dto.login;
		// user.email = dto.email;
		// user.password = dto.password;
		// user.isEmailConfirmed = isAdmin;
		//
		// if (!isAdmin) {
		// 	user.confirmationCode = randomUUID();
		// 	user.confirmationCodeExpirationDate = dayjs()
		// 		.add(1, "hour")
		// 		.toISOString();
		// }
		//
		// return user;
		//
		return user;
	}
}

UserSchema.loadClass(UserEntity);

export const UserModel = model<User, UserModel>("User", UserSchema);
