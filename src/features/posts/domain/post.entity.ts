import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";
import { CreatePostDto, UpdateLikeInfoDto, UpdatePostDto } from "../types/post.dto.js";

export type NewestLike = {
	addedAt: Date;
	userId: string;
	login: string;
}

export type ExtendedLikes = {
	likesCount: number;
	dislikesCount: number;
	newestLikes: NewestLike[]
}

export type Post = {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: Date;
	extendedLikesInfo: ExtendedLikes;
};

interface PostMethods {
	updatePost(dto: UpdatePostDto): void;

	updateLikeInfo(dto: UpdateLikeInfoDto): void;
}

type PostStatic = typeof PostEntity;

type PostModel = Model<Post, {}, PostMethods> & PostStatic;

export type PostDocument = HydratedDocument<Post, PostMethods>;

const newestLikeShema = new mongoose.Schema<NewestLike>({
	addedAt: { type: Date },
	userId: { type: String },
	login: { type: String },
});

const ExtendedLikesSchema = new mongoose.Schema<ExtendedLikes>({
	likesCount: { type: Number, default: 0, min: 0 },
	dislikesCount: { type: Number, default: 0, min: 0 },
	newestLikes: { type: [newestLikeShema], default: [] }
})

const PostSchema = new mongoose.Schema<Post, PostModel, PostMethods>({
	title: { type: String, trim: true, required: true },
	shortDescription: { type: String, trim: true, required: true },
	content: { type: String, trim: true, required: true },
	blogId: { type: String, required: true },
	blogName: { type: String, required: true },
	extendedLikesInfo: { type: ExtendedLikesSchema, default: { likesCount: 0, dislikesCount: 0, newestLikes: [] } },
}, {
	timestamps: true
});

class PostEntity {
	private constructor(
		public title: string,
		public shortDescription: string,
		public content: string,
		public blogId: string,
		public blogName: string,
		public extendedLikesInfo: ExtendedLikes
	) {}

	static createPost(dto: CreatePostDto, blogName: string) {
		const post = new PostModel();

		post.title = dto.title;
		post.shortDescription = dto.shortDescription;
		post.content = dto.content;
		post.blogId = dto.blogId;
		post.blogName = blogName;

		return post;
	}

	updatePost(dto: UpdatePostDto) {
		this.title = dto.title;
		this.shortDescription = dto.shortDescription;
		this.content = dto.content;
		this.blogId = dto.blogId;
		this.blogName = dto.blogName
	}

	updateLikeInfo(dto: UpdateLikeInfoDto) {
		this.extendedLikesInfo.likesCount = dto.likesCount;
		this.extendedLikesInfo.dislikesCount = dto.dislikesCount;
		this.extendedLikesInfo.newestLikes = dto.newestLikes;
	}


}

PostSchema.loadClass(PostEntity);

export const PostModel = model<Post, PostModel>("Post", PostSchema);
