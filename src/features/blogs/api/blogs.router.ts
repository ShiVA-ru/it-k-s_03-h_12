import { Router } from "express";
import { container } from "../../../composition-root.js";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware.js";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware.js";
import { superAdminGuardMiddleware } from "../../auth/api/middlewares/super-admin.guard.js";
import { blogPostInputDtoValidation } from "../../posts/api/validation/posts.input-dto.validation.middleware.js";
import { paginationSortingValidation } from "../../posts/api/validation/posts.query.validation.middleware.js";
import { blogInputDtoValidation } from "./validation/blogs.input-dto.validation.middleware.js";
import { paginationSortingSearchValidation } from "./validation/blogs.query.validation.middleware.js";
import { BlogsController } from "./blogs.controller.js";

const blogsController = container.get(BlogsController);

export const blogsRouter = Router();

blogsRouter
	.post(
		"/",
		superAdminGuardMiddleware,
		blogInputDtoValidation,
		inputValidationResultMiddleware,
		blogsController.createBlog.bind(blogsController),
	)

	.get(
		"/",
		paginationSortingSearchValidation,
		inputValidationResultMiddleware,
		blogsController.getBlogs.bind(blogsController),
	)

	.get(
		"/:id",
		idValidation,
		inputValidationResultMiddleware,
		blogsController.getBlog.bind(blogsController),
	)

	.put(
		"/:id",
		superAdminGuardMiddleware,
		idValidation,
		blogInputDtoValidation,
		inputValidationResultMiddleware,
		blogsController.updateBlog.bind(blogsController),
	)

	.delete(
		"/:id",
		superAdminGuardMiddleware,
		idValidation,
		inputValidationResultMiddleware,
		blogsController.deleteBlog.bind(blogsController),
	)

	.get(
		"/:id/posts",
		paginationSortingValidation,
		inputValidationResultMiddleware,
		blogsController.getBlogsPosts.bind(blogsController),
	)

	.post(
		"/:id/posts",
		superAdminGuardMiddleware,
		idValidation,
		blogPostInputDtoValidation,
		inputValidationResultMiddleware,
		blogsController.createBlogPost.bind(blogsController),
	);
