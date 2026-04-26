import type { WithId } from "mongodb";
import type { Blog } from "../../domain/blog.entity.js";
import type { BlogView } from "../../types/blogs.view.type.js";

export const mapEntityToViewModel = (dbEntity: WithId<Blog>): BlogView => ({
	id: dbEntity._id.toString(),
	name: dbEntity.name,
	description: dbEntity.description,
	websiteUrl: dbEntity.websiteUrl,
	createdAt: dbEntity.createdAt.toString(),
	isMembership: dbEntity.isMembership,
});
