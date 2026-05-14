import type { WithId } from "mongodb";
import type { Post } from "../../domain/post.entity.js";
import type { PostView } from "../../types/posts.view.type.js";
import { LikeStatus } from "../../../../core/types/like-status.type.js";

export const mapEntityToViewModel = (dbEntity: WithId<Post>, myStatus?: LikeStatus): PostView => ({
	id: dbEntity._id.toString(),
	title: dbEntity.title,
	shortDescription: dbEntity.shortDescription,
	content: dbEntity.content,
	blogId: dbEntity.blogId,
	blogName: dbEntity.blogName,
	createdAt: dbEntity.createdAt.toISOString(),
	extendedLikesInfo: {
		likesCount: dbEntity.extendedLikesInfo.likesCount,
		dislikesCount: dbEntity.extendedLikesInfo.dislikesCount,
		myStatus: myStatus ? myStatus : LikeStatus.None,
		newestLikes: dbEntity.extendedLikesInfo.newestLikes.map(item => ({
			addedAt: item.addedAt,
			userId: item.userId,
			login: item.login
		})),
	}
});
