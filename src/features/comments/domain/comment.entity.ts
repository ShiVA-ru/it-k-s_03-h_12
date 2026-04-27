import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";
import type { CommentatorInfoType } from "../types/comments.commentator-info.type.js";

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

type CommentModel = Model<Comment>;

export type CommentDocument = HydratedDocument<Comment>;

const LikeSchema = new mongoose.Schema<Like>({
	userId: { type: String, required: true },
	status: { type: String },
})

const CommentatorInfoSchema = new mongoose.Schema<CommentatorInfoType>({
	userId: { type: String, required: true },
	userLogin: { type: String, required: true },
});

const CommentSchema = new mongoose.Schema<Comment>({
	content: { type: String, trim: true, required: true },
	postId: { type: String, required: true },
	commentatorInfo: CommentatorInfoSchema,
	likes: { type: [LikeSchema], default: [] },
}, {
	timestamps: true
});

export const CommentModel = model<Comment, CommentModel>(
	"Comment",
	CommentSchema,
);
