import type { PostView } from "./posts.view.type.js";

export type BlogPostInput = Omit<
	PostView,
	"id" | "blogName" | "createdAt" | "blogId"
>;
