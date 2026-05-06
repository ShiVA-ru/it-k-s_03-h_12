import { LikeStatus } from "../../../core/types/like-status.type.js";

export type LikesView = {
	likesCount: number;
	dislikesCount: number;
	myStatus: LikeStatus;
}