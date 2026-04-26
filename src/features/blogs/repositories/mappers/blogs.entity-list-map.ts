import type { WithId } from "mongodb";
import type { Paginator } from "../../../../core/types/paginator.type.js";
import type { Blog } from "../../domain/blog.entity.js";
import type { BlogView } from "../../types/blogs.view.type.js";
import { mapEntityToViewModel } from "./blogs.entity-map.js";

export const mapBlogsToPaginatedView = (
	dbEntities: WithId<Blog>[],
	meta: {
		page: number;
		pageSize: number;
		totalCount: number;
	},
): Paginator<BlogView> => {
	const pagesCount = Math.ceil(meta.totalCount / meta.pageSize);

	const mappedBlogs = dbEntities.map(mapEntityToViewModel);

	return {
		items: mappedBlogs,
		pagesCount,
		page: meta.page,
		pageSize: meta.pageSize,
		totalCount: meta.totalCount,
	};
};
