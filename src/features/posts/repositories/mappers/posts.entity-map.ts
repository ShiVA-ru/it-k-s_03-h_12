import type { WithId } from "mongodb";
import type { Post } from "../../domain/post.entity.js";
import type { PostView } from "../../types/posts.view.type.js";

export const mapEntityToViewModel = (dbEntity: WithId<Post>): PostView => ({
	id: dbEntity._id.toString(),
	title: dbEntity.title,
	shortDescription: dbEntity.shortDescription,
	content: dbEntity.content,
	blogId: dbEntity.blogId,
	blogName: dbEntity.blogName,
	createdAt: dbEntity.createdAt.toISOString(),
});
