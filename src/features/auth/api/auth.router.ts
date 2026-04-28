import { Router } from "express";
import { container } from "../../../composition-root.js";
import { deviceMetaMiddleware } from "../../../core/middlewares/device-meta.middleware.js";
import { rateLimitGuardMiddleware } from "../../../core/middlewares/guards/rate-limit.guard.js";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware.js";
import { userInputDtoValidation } from "../../users/api/validation/users.input-dto.validation.middleware.js";
import { accessTokenGuardMiddleware } from "./middlewares/access-token.guard.js";
import { refreshTokenGuardMiddleware } from "./middlewares/refresh-token.guard.js";
import { loginInputDtoValidation } from "./validation/auth.input-dto.validation.middleware.js";
import { newPasswordDtoValidation } from "./validation/auth.new-pass.validation.middleware.js";
import { confirmationCodeValidation } from "./validation/auth.registration-confirm.validation.middleware.js";
import { emailValidation } from "./validation/auth.registration-resending.validation.middleware.js";
import { AuthController } from "./auth.controller.js";

export const authRouter = Router();

const authController = container.get(AuthController);

authRouter
	.post(
		"/login",
		rateLimitGuardMiddleware,
		loginInputDtoValidation,
		inputValidationResultMiddleware,
		deviceMetaMiddleware,
		authController.login.bind(authController),
	)
	.post(
		"/logout",
		refreshTokenGuardMiddleware,
		authController.logout.bind(authController),
	)

	.post(
		"/refresh-token",
		refreshTokenGuardMiddleware,
		authController.refreshToken.bind(authController),
	)

	.get(
		"/me",
		accessTokenGuardMiddleware,
		authController.getMe.bind(authController),
	)

	.post(
		"/registration",
		rateLimitGuardMiddleware,
		userInputDtoValidation,
		inputValidationResultMiddleware,
		authController.registration.bind(authController),
	)

	.post(
		"/registration-confirmation",
		rateLimitGuardMiddleware,
		confirmationCodeValidation,
		inputValidationResultMiddleware,
		authController.registrationConfirmation.bind(authController),
	)

	.post(
		"/registration-email-resending",
		rateLimitGuardMiddleware,
		emailValidation,
		inputValidationResultMiddleware,
		authController.registrationEmailResending.bind(authController),
	)

	.post(
		"/password-recovery",
		rateLimitGuardMiddleware,
		emailValidation,
		inputValidationResultMiddleware,
		authController.passwordRecovery.bind(authController),
	)

	.post(
		"/new-password",
		rateLimitGuardMiddleware,
		newPasswordDtoValidation,
		inputValidationResultMiddleware,
		authController.updatePassword.bind(authController),
	);
