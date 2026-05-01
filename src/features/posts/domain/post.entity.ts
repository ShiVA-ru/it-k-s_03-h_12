import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";
import {CreatePostDto} from "./dto.js";

export type Post = {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: Date;
};

interface PostMethods {}

type PostStatic = typeof PostEntity;

type PostModel = Model<Post, {}, PostMethods> & PostStatic;

export type PostDocument = HydratedDocument<Post, PostMethods>;

const PostSchema = new mongoose.Schema<Post, PostModel, PostMethods>({
	title: { type: String, trim: true, required: true },
	shortDescription: { type: String, trim: true, required: true },
	content: { type: String, trim: true, required: true },
	blogId: { type: String, required: true },
	blogName: { type: String, required: true },
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
	) {}

	static createPost (dto: CreatePostDto, blogName: string) {
		const post = new PostModel();

		post.title = dto.title;
		post.shortDescription = dto.shortDescription;
		post.content = dto.content;
		post.blogId = dto.blogId;
		post.blogName = blogName;

		return post;
	}
}

PostSchema.loadClass(PostEntity);

export const PostModel = model<Post, PostModel>("Post", PostSchema);
