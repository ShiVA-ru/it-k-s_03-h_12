import type { WithId } from "mongodb";
import type { Paginator } from "../../../../core/types/paginator.type.js";
import type { Comment } from "../../domain/comment.entity.js";
import type { CommentView } from "../../types/comments.view.type.js";
import { mapEntityToViewModel } from "./comments.entity-map.js";

export const mapCommentsToPaginatedView = (
	dbEntities: WithId<Comment>[],
	userId: string | undefined,
	meta: {
		page: number;
		pageSize: number;
		totalCount: number;
	},
): Paginator<CommentView> => {
	const pagesCount = Math.ceil(meta.totalCount / meta.pageSize);

	const mappedComments = dbEntities.map(entity => mapEntityToViewModel(entity, userId));

	return {
		items: mappedComments,
		pagesCount,
		page: meta.page,
		pageSize: meta.pageSize,
		totalCount: meta.totalCount,
	};
};
