import {injectable} from "inversify";
import type {Paginator} from "../../../core/types/paginator.type.js";
import {buildDbQueryOptions} from "../../../core/utils/build-db-query-options.js";
import {CommentModel} from "../domain/comment.entity.js";
import type {CommentsQueryInput} from "../types/comments.query.type.js";
import type {CommentView} from "../types/comments.view.type.js";
import {mapCommentsToPaginatedView} from "./mappers/comments.entity-list-map.js";
import {mapEntityToViewModel} from "./mappers/comments.entity-map.js";

@injectable()
export class CommentsQueryRepository {
	async findOneById(commentId: string, userId: string | undefined): Promise<CommentView | null> {
		const item = await CommentModel.findOne({ _id: commentId });

		if (!item) {
			return null;
		}

		return mapEntityToViewModel(item, userId);
	}

	async findByPostId(
		postId: string,
		userId: string | undefined,
		queryDto: CommentsQueryInput,
	): Promise<Paginator<CommentView>> {
		const { skip, limit, sort } = buildDbQueryOptions(queryDto);

		const filter = { postId: postId };

		const items = await CommentModel.find(filter)
			.skip(skip)
			.limit(limit)
			.sort(sort)
			.lean();

		const totalCount = await CommentModel.countDocuments(filter);

		return mapCommentsToPaginatedView(items, userId, {
			pageSize: queryDto.pageSize,
			page: queryDto.pageNumber,
			totalCount,
		});
	}
}
