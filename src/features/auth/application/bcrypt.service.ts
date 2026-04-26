import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../constants/hash.constants.js";

export const bcryptService = {
	async generateHash(password: string): Promise<string> {
		return bcrypt.hash(password, SALT_ROUNDS);
	},

	async checkPassword(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	},
};
