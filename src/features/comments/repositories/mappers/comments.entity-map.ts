import type {WithId} from "mongodb";
import {Comment, LikeStatus} from "../../domain/comment.entity.js";
import type {CommentView} from "../../types/comments.view.type.js";

export const mapEntityToViewModel = (
	dbEntity: WithId<Comment>,
	userId?: string,
): CommentView => ({
	id: dbEntity._id.toString(),
	content: dbEntity.content,
	commentatorInfo: {
		userId: dbEntity.commentatorInfo.userId,
		userLogin: dbEntity.commentatorInfo.userLogin,
	},
	createdAt: dbEntity.createdAt.toISOString(),
	likesInfo: {
		likesCount: dbEntity.likes.filter(l => l.status === LikeStatus.Like).length,
		dislikesCount: dbEntity.likes.filter(l => l.status === LikeStatus.Dislike).length,
		myStatus: dbEntity.likes.find(l => l.userId === userId)?.status ?? LikeStatus.None,
	}
});