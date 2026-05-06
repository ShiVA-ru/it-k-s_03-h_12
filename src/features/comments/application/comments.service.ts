import { inject, injectable } from "inversify";
import type { IdType } from "../../../core/types/id.types.js";
import { ResultStatus } from "../../../core/types/result.code.js";
import type { Result } from "../../../core/types/result.type.js";
import { PostsRepository } from "../../posts/infra/posts.repository.js";
import { UsersRepository } from "../../users/infra/users.repository.js";
import { CommentModel, LikeStatus } from "../domain/comment.entity.js";
import { CommentsRepository } from "../infra/comments.repository.js";
import type { CommentInput } from "../types/comments.input.type.js";

@injectable()
export class CommentsService {
	constructor(
		@inject(CommentsRepository)
		protected commentsRepository: CommentsRepository,
		@inject(PostsRepository)
		protected postsRepository: PostsRepository,
		@inject(UsersRepository)
		protected usersRepository: UsersRepository,
	) {}

	async create(
		userId: string,
		postId: string,
		dto: CommentInput,
	): Promise<Result<IdType | null>> {
		const post = await this.postsRepository.findOneById(postId);

		if (!post) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "Post not found",
				extensions: [],
				data: null,
			};
		}

		const user = await this.usersRepository.findOneById(userId);

		if (!user) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "User not found",
				extensions: [],
				data: null,
			};
		}

		const { content } = dto;

		const comment = CommentModel.createComment({
			content,
			postId,
			commentatorInfo: {
				userId,
				userLogin: user.login,
			}
		});

		const commentId = await this.commentsRepository.save(comment);

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: { id: commentId },
		};
	}

	async updateById(
		userId: string,
		id: string,
		dto: CommentInput,
	): Promise<Result<true>> {
		const comment = await this.commentsRepository.findOneById(id);

		if (!comment) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "comment not found",
				extensions: [],
				data: null,
			};
		}

		if (comment.commentatorInfo.userId !== userId) {
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "user is incorrect",
				extensions: [],
				data: null,
			};
		}

		comment.updateComment({ content: dto.content });

		const isUpdated = await this.commentsRepository.save(comment);

		if (!isUpdated) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "comment is not updated",
				extensions: [],
				data: null,
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: true,
		};
	}

	async setLikeStatus(
		userId: string,
		commentId: string,
		likeStatus: LikeStatus,
	): Promise<Result<true>> {
		const comment = await this.commentsRepository.findOneById(commentId);

		if (!comment) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "comment not found",
				extensions: [],
				data: null,
			};
		}

		comment.setLikeStatus({ userId, status: likeStatus });

		await this.commentsRepository.save(comment);

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: true,
		};

	}

	async deleteOneById(userId: string, id: string): Promise<Result<true>> {
		const deletedEntity = await this.commentsRepository.findOneById(id);

		if (!deletedEntity) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "comment not found",
				extensions: [],
				data: null,
			};
		}

		if (deletedEntity.commentatorInfo.userId !== userId) {
			return {
				status: ResultStatus.Forbidden,
				errorMessage: "user is incorrect",
				extensions: [],
				data: null,
			};
		}

		const isDeleted = await this.commentsRepository.deleteOneById(id);

		if (!isDeleted) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "comment is not deleted",
				extensions: [],
				data: null,
			};
		}

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: true,
		};
	}
}
