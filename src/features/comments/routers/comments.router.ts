import { Router } from "express";
import { container } from "../../../composition-root.js";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware.js";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware.js";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard.js";
import { commentInputDtoValidation } from "../validation/comments.input-dto.validation.middleware.js";
import { CommentsController } from "./comments.controller.js";
import {likeStatusInputDtoValidation} from "../validation/likes-status.input-dto.validation.middleware.js";
import {optionalAccessTokenGuardMiddleware} from "../../../core/middlewares/guards/optional-access-token.guard.js";

export const commentsRouter = Router();

const commentsController = container.get(CommentsController);

commentsRouter
	.get(
		"/:id",
		idValidation,
		optionalAccessTokenGuardMiddleware,
		inputValidationResultMiddleware,
		commentsController.getComment.bind(commentsController),
	)
	//UPDATE
	.put(
		"/:id",
		accessTokenGuardMiddleware,
		idValidation,
		commentInputDtoValidation,
		inputValidationResultMiddleware,
		commentsController.updateComment.bind(commentsController),
	)
	//UPDATE LIKE STATUS
	.put(
		"/:id/like-status",
		accessTokenGuardMiddleware,
		idValidation,
		likeStatusInputDtoValidation,
		inputValidationResultMiddleware,
		commentsController.updateLikeStatus.bind(commentsController),
	)
	// DELETE
	.delete(
		"/:id",
		accessTokenGuardMiddleware,
		idValidation,
		inputValidationResultMiddleware,
		commentsController.deleteComment.bind(commentsController),
	);
