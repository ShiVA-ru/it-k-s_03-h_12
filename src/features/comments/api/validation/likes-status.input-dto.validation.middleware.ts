import { body } from "express-validator";

import { LikeStatus } from "../../../../core/types/like-status.type.js";

const likeStatus = Object.values(LikeStatus)

const likeStatusValidation = body("likeStatus")
	.trim()
	.isString()
	.withMessage("Field must be a string")
	.isIn(likeStatus)
	.withMessage("Field must be None, Like or Dislike");

export const likeStatusInputDtoValidation = [likeStatusValidation];
