import { Router } from "express";
import { container } from "../../../composition-root.js";
import { deviceMetaMiddleware } from "../../../core/middlewares/device-meta.middleware.js";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware.js";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware.js";
import { refreshTokenGuardMiddleware } from "../../auth/api/middlewares/refresh-token.guard.js";
import { DevicesController } from "./devices.controller.js";

const devicesController = container.get(DevicesController);

export const devicesRouter = Router();

devicesRouter
	.get(
		"/",
		deviceMetaMiddleware,
		refreshTokenGuardMiddleware,
		devicesController.getUserActiveSessions.bind(devicesController),
	)

	.delete(
		"/",
		refreshTokenGuardMiddleware,
		devicesController.deleteDevices.bind(devicesController),
	)

	.delete(
		"/:id",
		refreshTokenGuardMiddleware,
		idValidation,
		inputValidationResultMiddleware,
		devicesController.deleteDeviceByIdHandler.bind(devicesController),
	);
