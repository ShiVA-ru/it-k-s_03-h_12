import { NewestLike } from "../domain/post.entity.js";

export type CreatePostDto = {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
}

export type UpdatePostDto = {
	id: string;
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
}

export type UpdateLikeInfoDto = {
	likesCount: number;
	dislikesCount: number;
	newestLikes: NewestLike[];
}