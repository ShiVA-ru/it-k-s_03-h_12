import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";

export type Blog = {
	name: string;
	description: string;
	websiteUrl: string;
	createdAt: Date;
	isMembership: boolean;
};

type BlogModel = Model<Blog>;

export type BlogDocument = HydratedDocument<Blog>;

const BlogSchema = new mongoose.Schema<Blog>({
	name: { type: String, trim: true, required: true },
	description: { type: String, trim: true, required: true },
	websiteUrl: { type: String, trim: true, required: true },
	createdAt: { type: Date, default: Date.now },
	isMembership: { type: Boolean, default: false },
});

export const BlogModel = model<Blog, BlogModel>("Blog", BlogSchema);
