import type { WithId } from "mongodb";
import type { Paginator } from "../../../../core/types/paginator.type.js";
import type { Post } from "../../domain/post.entity.js";
import type { PostView } from "../../types/posts.view.type.js";
import { mapEntityToViewModel } from "./posts.entity-map.js";
import { UserLikes } from "../../types/user-likes.type.js";

export const mapPostsToPaginatedView = (
	dbEntities: WithId<Post>[],
	meta: {
		page: number;
		pageSize: number;
		totalCount: number;
	},
	userLikes: UserLikes[]
): Paginator<PostView> => {
	const pagesCount = Math.ceil(meta.totalCount / meta.pageSize);

	const mappedPosts = dbEntities.map((item) => {
		const postLike = userLikes.find(post => post.postId === item._id.toString());
		const userLikeStatus = postLike ? postLike.status : undefined;

		return mapEntityToViewModel(item, userLikeStatus);
	});

	return {
		items: mappedPosts,
		pagesCount,
		page: meta.page,
		pageSize: meta.pageSize,
		totalCount: meta.totalCount,
	};
};
