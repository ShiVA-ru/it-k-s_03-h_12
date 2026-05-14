import { LikeStatus } from "../../../core/types/like-status.type.js";

export type UserLikes = {
	postId: string;
	status: LikeStatus;
}