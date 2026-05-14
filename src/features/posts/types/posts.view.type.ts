import { NewestLike } from "../domain/post.entity.js";
import { LikeStatus } from "../../../core/types/like-status.type.js";

type ExtendedLikesView = {
	likesCount: number;
	dislikesCount: number;
	myStatus: LikeStatus,
	newestLikes: NewestLike[]
}

export type PostView = {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt?: string;
	extendedLikesInfo: ExtendedLikesView
};
