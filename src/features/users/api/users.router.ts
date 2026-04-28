import { Router } from "express";
import { container } from "../../../composition-root.js";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware.js";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware.js";
import { superAdminGuardMiddleware } from "../../auth/api/middlewares/super-admin.guard.js";
import { userInputDtoValidation } from "./validation/users.input-dto.validation.middleware.js";
import { paginationSortingSearchValidation } from "./validation/users.query.validation.middleware.js";
import { UsersController } from "./users.controller.js";

const usersController = container.get(UsersController);

export const usersRouter = Router();

usersRouter.use(superAdminGuardMiddleware);

usersRouter
	.post(
		"/",
		userInputDtoValidation,
		inputValidationResultMiddleware,
		usersController.createUser.bind(usersController),
	)
	.get(
		"/",
		paginationSortingSearchValidation,
		inputValidationResultMiddleware,
		usersController.getUsers.bind(usersController),
	)

	.get(
		"/:id",
		idValidation,
		inputValidationResultMiddleware,
		usersController.getUser.bind(usersController),
	)

	.delete(
		"/:id",
		idValidation,
		inputValidationResultMiddleware,
		usersController.deleteUser.bind(usersController),
	);
