import type { Response } from "express";
import { inject, injectable } from "inversify";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";
import type { IdType } from "../../../core/types/id.types.js";
import type {
	RequestWithParams,
	RequestWithParamsBodyUserId,
	RequestWithParamsUserId,
} from "../../../core/types/request.types.js";
import type { URIParamsId } from "../../../core/types/uri-params.type.js";
import { resultCodeToHttpException } from "../../../core/utils/result-code-to-http-exception.js";
import { isSuccessResult } from "../../../core/utils/type-guards.js";
import { CommentsService } from "../application/comments.service.js";
import { CommentsQueryRepository } from "../infra/comments.query.repository.js";
import type { CommentInput } from "../types/comments.input.type.js";
import type { CommentView } from "../types/comments.view.type.js";
import {LikeStatusInput} from "../types/likes-status.input.type.js";

@injectable()
export class CommentsController {
	constructor(
		@inject(CommentsService)
		protected commentsService: CommentsService,
		@inject(CommentsQueryRepository)
		protected commentsQueryRepository: CommentsQueryRepository,
	) {}
	async getComment(
		req: RequestWithParams<URIParamsId>,
		res: Response<CommentView>,
	) {
		try {
			const userId = req.userId;
			const comment = await this.commentsQueryRepository.findOneById(
				req.params.id, userId
			);

			if (!comment) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			return res.status(HttpStatus.Ok).json(comment);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async updateComment(
		req: RequestWithParamsBodyUserId<URIParamsId, CommentInput, IdType>,
		res: Response<CommentView | { message: string }>,
	) {
		try {
			const userId = req.userId;

			if (!userId) {
				return res.status(HttpStatus.Unauthorized).send({
					message: `user not found`,
				});
			}

			const result = await this.commentsService.updateById(
				userId,
				req.params.id,
				req.body,
			);

			if (!isSuccessResult(result)) {
				return res.status(resultCodeToHttpException(result.status)).send({
					message: result.errorMessage ? result.errorMessage : "",
				});
			}

			res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async updateLikeStatus(
		req: RequestWithParamsBodyUserId<URIParamsId, LikeStatusInput, IdType>,
		res: Response,
	) {
		try {
			const userId = req.userId;
			const commentId = req.params.id;
			const likeStatus = req.body.likeStatus;

			if (!userId) {
				return res.status(HttpStatus.Unauthorized).send({
					message: `user not found`,
				});
			}

			const result = await this.commentsService.setLikeStatus(
				userId,
				commentId,
				likeStatus,
			);

			if (!isSuccessResult(result)) {
				return res.status(resultCodeToHttpException(result.status)).send({
					message: result.errorMessage ? result.errorMessage : "",
				});
			}

			res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async deleteComment(
		req: RequestWithParamsUserId<URIParamsId, IdType>,
		res: Response,
	) {
		try {
			const userId = req.userId;

			if (!userId) {
				return res.status(HttpStatus.Unauthorized).send({
					message: `user not found`,
				});
			}

			const result = await this.commentsService.deleteOneById(
				userId,
				req.params.id,
			);

			if (!isSuccessResult(result)) {
				return res.status(resultCodeToHttpException(result.status)).send({
					message: result.errorMessage ? result.errorMessage : "",
				});
			}

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}
}
