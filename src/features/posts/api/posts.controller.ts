import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { inject, injectable } from "inversify";
import type { validationErrorsDto } from "../../../core/types/errors.types.js";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";
import type { IdType } from "../../../core/types/id.types.js";
import type { Paginator } from "../../../core/types/paginator.type.js";
import type {
	RequestWithBody,
	RequestWithParams,
	RequestWithParamsAndBody,
	RequestWithParamsBodyUserId,
} from "../../../core/types/request.types.js";
import type { URIParamsId } from "../../../core/types/uri-params.type.js";
import { isSuccessResult } from "../../../core/utils/type-guards.js";
import { CommentsService } from "../../comments/application/comments.service.js";
import { CommentsQueryRepository } from "../../comments/infra/comments.query.repository.js";
import type { CommentInput } from "../../comments/types/comments.input.type.js";
import type { CommentsQueryInput } from "../../comments/types/comments.query.type.js";
import type { CommentView } from "../../comments/types/comments.view.type.js";
import { PostsService } from "../application/posts.service.js";
import { PostsQueryRepository } from "../infra/posts.query.repository.js";
import { PostsRepository } from "../infra/posts.repository.js";
import type { PostInput } from "../types/posts.input.type.js";
import type { PostsQueryInput } from "../types/posts.query.type.js";
import type { PostView } from "../types/posts.view.type.js";

@injectable()
export class PostsController {
	constructor(
		@inject(CommentsService)
		protected commentsService: CommentsService,
		@inject(CommentsQueryRepository)
		protected commentsQueryRepository: CommentsQueryRepository,
		@inject(PostsQueryRepository)
		protected postsQueryRepository: PostsQueryRepository,
		@inject(PostsRepository)
		protected postsRepository: PostsRepository,
		@inject(PostsService)
		protected postsService: PostsService,
	) {}

	async getPost(
		req: RequestWithParams<URIParamsId>,
		res: Response<PostView | validationErrorsDto>,
	) {
		try {
			const findEntity = await this.postsQueryRepository.findOneById(
				req.params.id,
			);

			if (!findEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			return res.status(HttpStatus.Ok).json(findEntity);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.NotFound);
		}
	}

	async getPosts(req: Request, res: Response<Paginator<PostView>>) {
		try {
			const queryData = matchedData<PostsQueryInput>(req, {
				locations: ["query"],
			});

			const postsListOutput =
				await this.postsQueryRepository.findAll(queryData);

			res.status(HttpStatus.Ok).json(postsListOutput);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async getPostComments(
		req: RequestWithParams<IdType>,
		res: Response<Paginator<CommentView>>,
	) {
		try {
			const userId = req.userId;
			const postId = req.params.id;
			const queryData = matchedData<CommentsQueryInput>(req, {
				locations: ["query"],
			});

			const queryPost = await this.postsRepository.findOneById(postId);

			if (!queryPost) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			const commentsListOutput =
				await this.commentsQueryRepository.findByPostId(postId, userId, queryData);

			return res.status(HttpStatus.Ok).json(commentsListOutput);
		} catch (error) {
			console.error(error);
			return res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async createPost(
		req: RequestWithBody<PostInput>,
		res: Response<PostView | validationErrorsDto>,
	) {
		try {
			const insertedId = await this.postsService.create(req.body);

			if (!insertedId) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			const createdEntity =
				await this.postsQueryRepository.findOneById(insertedId);

			if (!createdEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			res.status(HttpStatus.Created).json(createdEntity);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async createPostComment(
		req: RequestWithParamsBodyUserId<URIParamsId, CommentInput, IdType>,
		res: Response<CommentView>,
	) {
		try {
			const userId = req.userId;

			if (!userId) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			const postId = req.params.id;

			if (!postId) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			const createResult = await this.commentsService.create(
				userId,
				postId,
				req.body,
			);

			if (!isSuccessResult(createResult)) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			const createdEntity = await this.commentsQueryRepository.findOneById(
				createResult.data.id, userId
			);

			if (!createdEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			return res.status(HttpStatus.Created).json(createdEntity);
		} catch (error) {
			console.error(error);
			return res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async updatePost(
		req: RequestWithParamsAndBody<URIParamsId, PostInput>,
		res: Response<PostView | validationErrorsDto | { message: string }>,
	) {
		try {
			const updateStatus = await this.postsService.updateById(
				req.params.id,
				req.body,
			);

			if (updateStatus.notFound) {
				return res
					.status(HttpStatus.NotFound)
					.send({ message: `${updateStatus.entity} not found` });
			}

			res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async deletePost(req: RequestWithParams<URIParamsId>, res: Response) {
		try {
			const isDeleted = await this.postsService.deleteOneById(req.params.id);

			if (!isDeleted) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.NotFound);
		}
	}
}
