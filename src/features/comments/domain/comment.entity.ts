import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";
import type { CommentatorInfoType } from "../types/comments.commentator-info.type.js";
import { CreateCommentDto, LikeStatusDto, UpdateCommentDto } from "../types/dto.js";

export enum LikeStatus {
	None = 'None',
	Like = 'Like',
	Dislike = 'Dislike',
}

export type Like = {
	userId: string;
	status: LikeStatus.Like | LikeStatus.Dislike;
}

export type Comment = {
	content: string;
	postId: string;
	commentatorInfo: CommentatorInfoType;
	createdAt: Date;
	likes: Like[];
};

interface CommentMethods {
	updateComment(dto: UpdateCommentDto): void;

	setLikeStatus(dto: LikeStatusDto): void;
}

type CommentStatic = typeof CommentEntity;

type CommentModel = Model<Comment, {}, CommentMethods> & CommentStatic;

export type CommentDocument = HydratedDocument<Comment, CommentMethods>;

const LikeSchema = new mongoose.Schema<Like>({
	userId: { type: String, required: true },
	status: { type: String },
})

const CommentatorInfoSchema = new mongoose.Schema<CommentatorInfoType>({
	userId: { type: String, required: true },
	userLogin: { type: String, required: true },
});

const CommentSchema = new mongoose.Schema<Comment, CommentModel, CommentMethods>({
	content: { type: String, trim: true, required: true },
	postId: { type: String, required: true },
	commentatorInfo: CommentatorInfoSchema,
	likes: { type: [LikeSchema], default: [] },
}, {
	timestamps: true
});

class CommentEntity {
	private constructor(
		public content: string,
		public postId: string,
		public commentatorInfo: CommentatorInfoType,
		public createdAt: Date,
		public likes: Like[],
	) {}

	//TODO написать тесты для Comment

	static createComment(dto: CreateCommentDto) {
		const comment = new CommentModel();

		comment.content = dto.content;
		comment.postId = dto.postId;
		comment.commentatorInfo = dto.commentatorInfo;

		return comment;
	}

	updateComment(dto: UpdateCommentDto) {
		this.content = dto.content;
	}

	setLikeStatus(dto: LikeStatusDto) {
		const likeIndex = this.likes.findIndex(like => like.userId === dto.userId);

		if (dto.status === LikeStatus.None) {
			this.likes = this.likes.filter(like => like.userId !== dto.userId);
		} else if (likeIndex !== -1) {
			this.likes[likeIndex].status = dto.status;
		} else {
			this.likes.push({ userId: dto.userId, status: dto.status });
		}
	}
}

CommentSchema.loadClass(CommentEntity);

export const CommentModel = model<Comment, CommentModel>(
	"Comment",
	CommentSchema,
);
