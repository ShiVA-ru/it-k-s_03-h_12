import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../constants/hash.constants.js";
import {injectable} from "inversify";

@injectable()
export class BcryptService {
	async generateHash(password: string): Promise<string> {
		return bcrypt.hash(password, SALT_ROUNDS);
	}

	async checkPassword(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}
}
