import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";

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

type UserModel = Model<User>;

export type UserDocument = HydratedDocument<User>;

const UserSchema = new mongoose.Schema<User>({
	login: { type: String, trim: true, required: true }, //!TODO добавить unique: true
	email: { type: String, trim: true, required: true }, //!TODO добавить unique: true
	password: { type: String, trim: true, required: true },
	isEmailConfirmed: { type: Boolean, required: true },
	createdAt: { type: Date, default: Date.now }, //!TODO уточнить тип данных
	confirmationCode: { type: String, default: null },
	confirmationCodeExpirationDate: { type: String, default: null },
	recoveryCode: { type: String, default: null },
	recoveryCodeExpirationDate: { type: String, default: null },
});

export const UserModel = model<User, UserModel>("User", UserSchema);
