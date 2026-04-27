import type { HydratedDocument, Model } from "mongoose";
import mongoose, { model } from "mongoose";

export type Post = {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string;
	blogName: string;
	createdAt: Date;
};

type PostModel = Model<Post>;

export type PostDocument = HydratedDocument<Post>;

const PostSchema = new mongoose.Schema<Post>({
	title: { type: String, trim: true, required: true },
	shortDescription: { type: String, trim: true, required: true },
	content: { type: String, trim: true, required: true },
	blogId: { type: String, required: true },
	blogName: { type: String, required: true },
}, {
	timestamps: true
});

export const PostModel = model<Post, PostModel>("Post", PostSchema);
