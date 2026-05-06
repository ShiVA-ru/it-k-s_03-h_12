import type { CommentatorInfoType } from "./comments.commentator-info.type.js";
import { LikeStatus } from "../domain/comment.entity.js";

export type CreateCommentDto = {
	content: string;
	postId: string;
	commentatorInfo: CommentatorInfoType;
}

export type UpdateCommentDto = {
	content: string;
}

export type LikeStatusDto = {
	userId: string;
	status: LikeStatus;
}