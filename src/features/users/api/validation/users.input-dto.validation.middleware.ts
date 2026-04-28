import { body } from "express-validator";
import {
	EMAIL_REGEX,
	LOGIN_REGEX,
} from "../../../../core/constants/regex.constants.js";

const loginValidation = body("login")
	.trim()
	.isString()
	.withMessage("Field must be a string")
	.isLength({ min: 3, max: 10 })
	.withMessage("Field length must be between 1 and 15 characters")
	.matches(LOGIN_REGEX)
	.withMessage("Field must be a valid Login");

const passwordValidation = body("password")
	.trim()
	.isString()
	.withMessage("Field must be a string")
	.isLength({ min: 6, max: 20 })
	.withMessage("Field length must be between 1 and 500 characters");

const emailValidation = body("email")
	.trim()
	.isEmail()
	.withMessage("Field must be a email")
	.matches(EMAIL_REGEX)
	.withMessage("Field must be a valid URL")
	.isLength({ min: 1, max: 100 })
	.withMessage("Field length must be between 1 and 100 characters");

export const userInputDtoValidation = [
	loginValidation,
	passwordValidation,
	emailValidation,
];
