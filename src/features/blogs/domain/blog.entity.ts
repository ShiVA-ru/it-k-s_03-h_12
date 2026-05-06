import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";
import type { CreateBlogDto, UpdateBlogDto } from "../types/blog.dto.js";

export type NewestLike = {
	userId: string;
	login: string;
	createdAt: string; //in ViewModel - addedAt
}

export type ExtendedLikes = {
	likesCount: number;
	dislikesCount: number;
	newestLikes: NewestLike[]
}

export type Blog = {
	name: string;
	description: string;
	websiteUrl: string;
	createdAt: Date;
	isMembership: boolean;
	extendedLikesInfo: ExtendedLikes;
};

interface BlogMethods {
	updateBlog(dto: UpdateBlogDto): void
}

type BlogStatic = typeof BlogEntity;

type BlogModel = Model<Blog, {}, BlogMethods> & BlogStatic;

export type BlogDocument = HydratedDocument<Blog, BlogMethods>;

const newestLikesShema = new mongoose.Schema<NewestLike>({
	userId: String,
	login: String,
}, { timestamps: true });

const ExtendedLikesSchema = new mongoose.Schema<ExtendedLikes>({
	likesCount: { type: Number, default: 0 },
	dislikesCount: { type: Number, default: 0 },
	newestLikes: { type: [newestLikesShema], default: [] }
})

const BlogSchema = new mongoose.Schema<Blog, BlogModel, BlogMethods>({
	name: { type: String, trim: true, required: true },
	description: { type: String, trim: true, required: true },
	websiteUrl: { type: String, trim: true, required: true },
	isMembership: { type: Boolean, default: false },
}, {
	timestamps: true
});

class BlogEntity {
	private constructor(
		public name: string,
		public description: string,
		public websiteUrl: string,
		public isMembership: boolean = false,
	) {}

	static createBlog(dto: CreateBlogDto) {
		const blog = new BlogModel();

		blog.name = dto.name;
		blog.description = dto.description;
		blog.websiteUrl = dto.websiteUrl;

		return blog;
	}

	updateBlog(dto: UpdateBlogDto) {
		this.name = dto.name;
		this.description = dto.description;
		this.websiteUrl = dto.websiteUrl;
	}
}

BlogSchema.loadClass(BlogEntity);

export const BlogModel = model<Blog, BlogModel>("Blog", BlogSchema);
