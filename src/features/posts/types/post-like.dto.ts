import { LikeStatus } from "../../../core/types/like-status.type.js";

export type CreatePostLikeDto = {
	userId: string;
	postId: string;
	login: string;
	status: LikeStatus;
}

export type UpdateStatusDto = {
	status: LikeStatus;
}