import { body } from "express-validator";

const recoveryCode = body("recoveryCode")
	.trim()
	.isString()
	.withMessage("Field must be a string");

const passwordValidation = body("newPassword")
	.trim()
	.isString()
	.withMessage("Field must be a string")
	.isLength({ min: 6, max: 20 })
	.withMessage("Field length must be between 16 and 20 characters");

export const newPasswordDtoValidation = [recoveryCode, passwordValidation];
