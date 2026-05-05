import type { NextFunction, Request, Response } from "express";
import { type ValidationError, validationResult } from "express-validator";
import type {
	validationErrorsDto,
	validationErrorType,
} from "../../types/errors.types.js";
import { HttpStatus } from "../../types/http-statuses.types.js";

export const createErrorMessages = (
	errors: validationErrorType[],
): validationErrorsDto => {
	return { errorsMessages: errors };
};

const formatErrors = (error: ValidationError) => ({
	field: error.type === "field" ? error.path : null,
	message: error.msg,
});

export const inputValidationResultMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const errors = validationResult(req)
		.formatWith(formatErrors)
		.array({ onlyFirstError: true });
	if (errors.length) {
		return res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
	}

	next();
};
