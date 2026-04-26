import { body } from "express-validator";
import { EMAIL_REGEX } from "../../../core/constants/regex.constants.js";

export const emailValidation = body("email")
	.trim()
	.isString()
	.withMessage("Field must be a string")
	.custom((value) => {
		return EMAIL_REGEX.test(value);
	})
	.withMessage("Field must be a valid email");
