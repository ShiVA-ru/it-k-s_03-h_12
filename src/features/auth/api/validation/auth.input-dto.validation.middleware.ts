import { body } from "express-validator";
import {
	EMAIL_REGEX,
	LOGIN_REGEX,
} from "../../../../core/constants/regex.constants.js";

const loginOrEmailValidation = body("loginOrEmail")
	.trim()
	.isString()
	.withMessage("Field must be a string")
	.isLength({ min: 3, max: 30 })
	.withMessage("Field length must be between 3 and 20 characters")
	.custom((value) => {
		return LOGIN_REGEX.test(value) || EMAIL_REGEX.test(value);
	})
	.withMessage("Field must be a valid Login or email");

const passwordValidation = body("password")
	.trim()
	.isString()
	.withMessage("Field must be a string")
	.isLength({ min: 6, max: 20 })
	.withMessage("Field length must be between 1 and 500 characters");

export const loginInputDtoValidation = [
	loginOrEmailValidation,
	passwordValidation,
];
