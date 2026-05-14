import { ObjectId } from "mongodb";
import mongoose, { type HydratedDocument, model, Model } from "mongoose";
import { LikeStatus } from "../../../core/types/like-status.type.js";
import { CreatePostLikeDto, UpdateStatusDto } from "../types/post-like.dto.js";

export type PostLike = {
	id: ObjectId;
	postId: string;
	userId: string;
	login: string;
	status: LikeStatus;
	addedAt: Date;
}

interface PostLikeMethods {
	updateStatus(dto: UpdateStatusDto): void;
}

type PostLikeStatic = typeof PostLikeEntity;

type PostLikeModel = Model<PostLike, {}, PostLikeMethods> & PostLikeStatic;
export type PostLikeDocument = HydratedDocument<PostLike, PostLikeMethods>;

const PostLikeSchema = new mongoose.Schema<PostLike, PostLikeModel, PostLikeMethods>({
	postId: { type: String, required: true },
	userId: { type: String, required: true },
	login: { type: String, required: true },
	status: { type: String, enum: LikeStatus },
	addedAt: { type: Date, default: Date.now },
});

class PostLikeEntity {
	private constructor(
		public postId: string,
		public userId: string,
		public login: string,
		public status: LikeStatus,
		public addedAt: Date,
	) {}

	static createPostLike(dto: CreatePostLikeDto) {
		const postLike = new PostLikeModel();

		postLike.postId = dto.postId;
		postLike.userId = dto.userId;
		postLike.login = dto.login;
		postLike.status = dto.status;

		return postLike;
	}

	updateStatus(dto: UpdateStatusDto) {
		this.status = dto.status;
	}
}

PostLikeSchema.loadClass(PostLikeEntity)

export const PostLikeModel = model<PostLike, PostLikeModel>("PostLike", PostLikeSchema)