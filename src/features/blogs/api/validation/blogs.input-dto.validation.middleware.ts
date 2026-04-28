import { body } from "express-validator";
import { URL_REGEX } from "../../../../core/constants/regex.constants.js";

const nameValidation = body("name")
	.trim()
	.isString()
	.withMessage("Field must be a string")
	.isLength({ min: 1, max: 15 })
	.withMessage("Field length must be between 1 and 15 characters");

const descriptionValidation = body("description")
	.trim()
	.isString()
	.withMessage("Field must be a string")
	.isLength({ min: 1, max: 500 })
	.withMessage("Field length must be between 1 and 500 characters");

const websiteUrlValidation = body("websiteUrl")
	.trim()
	.isURL()
	.withMessage("Field must be a URL")
	.matches(URL_REGEX)
	.withMessage("Field must be a valid URL")
	.isLength({ min: 1, max: 100 })
	.withMessage("Field length must be between 1 and 100 characters");

export const blogInputDtoValidation = [
	nameValidation,
	descriptionValidation,
	websiteUrlValidation,
];
