import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { inject, injectable } from "inversify";
import type {
	validationErrorsDto,
	validationErrorType,
} from "../../../core/types/errors.types.js";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";
import type { Paginator } from "../../../core/types/paginator.type.js";
import type {
	RequestWithBody,
	RequestWithParams,
} from "../../../core/types/request.types.js";
import type { URIParamsId } from "../../../core/types/uri-params.type.js";
import { UsersService } from "../application/users.service.js";
import { UsersQueryRepository } from "../infra/users.query.repository.js";
import type { UserInput } from "../types/users.input.type.js";
import type { UsersQueryInput } from "../types/users.query.type.js";
import type { UserView } from "../types/users.view.type.js";
import {isSuccessResult} from "../../../core/utils/type-guards.js";
import {resultCodeToHttpException} from "../../../core/utils/result-code-to-http-exception.js";
// import {createErrorMessages} from "../../../core/middlewares/validation/input-validation-result.middleware.js";

@injectable()
export class UsersController {
	constructor(
		@inject(UsersQueryRepository)
		private usersQueryRepository: UsersQueryRepository,
		@inject(UsersService)
		private usersService: UsersService,
	) {}

	async getUser(
		req: RequestWithParams<URIParamsId>,
		res: Response<UserView | validationErrorsDto>,
	) {
		try {
			const findEntity = await this.usersQueryRepository.findOneById(
				req.params.id,
			);

			if (!findEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			res.status(HttpStatus.Ok).json(findEntity);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async getUsers(req: Request, res: Response<Paginator<UserView>>) {
		try {
			const queryData = matchedData<UsersQueryInput>(req, {
				locations: ["query"],
			});

			const usersListOutput =
				await this.usersQueryRepository.findAll(queryData);

			res.status(HttpStatus.Ok).json(usersListOutput);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async createUser(
		req: RequestWithBody<UserInput>,
		res: Response<UserView | validationErrorType[]>,
	) {
		try {
			const result = await this.usersService.create(req.body, true);

			if (!isSuccessResult(result)) {
				return res
					.status(resultCodeToHttpException(result.status))
			}

			const createdEntity = await this.usersQueryRepository.findOneById(
				result.data.insertedId,
			);

			if (!createdEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			res.status(HttpStatus.Created).json(createdEntity);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async deleteUser(req: RequestWithParams<URIParamsId>, res: Response) {
		try {
			const isDeleted = await this.usersService.deleteOneById(req.params.id);

			if (!isDeleted) {
				res.sendStatus(HttpStatus.NotFound);
				return;
			}

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}
}
