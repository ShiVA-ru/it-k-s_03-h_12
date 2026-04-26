import { Router } from "express";
import { container } from "../../../composition-root.js";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware.js";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware.js";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard.js";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard.js";
import { commentInputDtoValidation } from "../../comments/validation/comments.input-dto.validation.middleware.js";
import { postInputDtoValidation } from "../validation/posts.input-dto.validation.middleware.js";
import { paginationSortingValidation } from "../validation/posts.query.validation.middleware.js";
import { PostsController } from "./posts.controller.js";
import {optionalAccessTokenGuardMiddleware} from "../../../core/middlewares/guards/optional-access-token.guard.js";

const postsController = container.get(PostsController);

export const postsRouter = Router();

//Заменить тип Response PostView на DTO

postsRouter
	//CREATE
	.post(
		"/",
		superAdminGuardMiddleware,
		postInputDtoValidation,
		inputValidationResultMiddleware,
		postsController.createPost.bind(postsController),
	)
	//READ
	.get(
		"/",
		paginationSortingValidation,
		inputValidationResultMiddleware,
		postsController.getPosts.bind(postsController),
	)

	.get(
		"/:id",
		idValidation,
		inputValidationResultMiddleware,
		postsController.getPost.bind(postsController),
	)
	//UPDATE
	.put(
		"/:id",
		superAdminGuardMiddleware,
		idValidation,
		postInputDtoValidation,
		inputValidationResultMiddleware,
		postsController.updatePost.bind(postsController),
	)
	//DELETE
	.delete(
		"/:id",
		superAdminGuardMiddleware,
		idValidation,
		inputValidationResultMiddleware,
		postsController.deletePost.bind(postsController),
	)
	.get(
		"/:id/comments",
		optionalAccessTokenGuardMiddleware,
		idValidation,
		paginationSortingValidation,
		inputValidationResultMiddleware,
		postsController.getPostComments.bind(postsController),
	)
	//TODO add validation for dto
	.post(
		"/:id/comments",
		accessTokenGuardMiddleware,
		idValidation,
		commentInputDtoValidation,
		inputValidationResultMiddleware,
		postsController.createPostComment.bind(postsController),
	);
