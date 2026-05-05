import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";
import type { IdType } from "../../../core/types/id.types.js";
import type {
	RequestWithParams,
	RequestWithUserId,
} from "../../../core/types/request.types.js";
import type { URIParamsId } from "../../../core/types/uri-params.type.js";
import { DevicesService } from "../application/devices.service.js";
import { DevicesQueryRepository } from "../infra/devices.query.repository.js";
import type { DeviceView } from "../types/devices.view.type.js";

@injectable()
export class DevicesController {
	constructor(
		@inject(DevicesQueryRepository)
		protected devicesQueryRepository: DevicesQueryRepository,
		@inject(DevicesService)
		protected devicesService: DevicesService,
	) {}

	async getUserActiveSessions(
		req: RequestWithUserId<IdType>,
		res: Response<DeviceView[]>,
	) {
		try {
			const userId = req.refreshTokenPayload.userId;

			if (!userId) {
				return res.sendStatus(HttpStatus.Unauthorized);
			}

			const devicesListOutput =
				await this.devicesQueryRepository.findAll(userId);

			res.status(HttpStatus.Ok).json(devicesListOutput);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async deleteDevices(req: Request, res: Response) {
		try {
			const { userId, deviceId } = req.refreshTokenPayload;

			if (!userId || !deviceId) {
				return res.sendStatus(HttpStatus.Unauthorized);
			}

			const isDeleted = await this.devicesService.deleteOther(userId, deviceId);

			// if (!isDeleted) {
			// 	return res.sendStatus(HttpStatus.NotFound);
			// }

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async deleteDeviceByIdHandler(
		req: RequestWithParams<URIParamsId>,
		res: Response,
	) {
		try {
			const deviceId = req.params.id;
			const userId = req.refreshTokenPayload.userId;

			const findEntity = await this.devicesService.findByDeviceId(deviceId);

			if (!userId || !findEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			if (findEntity.userId !== userId) {
				return res.sendStatus(HttpStatus.Forbidden);
			}

			const isDeleted = await this.devicesService.deleteOneById(
				req.params.id,
				userId,
			);

			if (!isDeleted) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}
}
