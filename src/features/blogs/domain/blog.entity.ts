import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";
import {Dto} from "./dto.js";

export type Blog = {
	name: string;
	description: string;
	websiteUrl: string;
	createdAt: Date;
	isMembership: boolean;
};

interface BlogMethods {}

type BlogStatic = typeof BlogEntity;

type BlogModel = Model<Blog, {}, BlogMethods> & BlogStatic;

export type BlogDocument = HydratedDocument<Blog, BlogMethods>;

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

	static createBlog (dto: Dto) {
		const blog = new BlogModel(dto);

		// const blog = new BlogModel();
		//
		// blog.name = dto.name;
		// blog.description = dto.description;
		// blog.websiteUrl = dto.websiteUrl;

		return blog;
	}
}

BlogSchema.loadClass(BlogEntity);

export const BlogModel = model<Blog, BlogModel>("Blog", BlogSchema);
