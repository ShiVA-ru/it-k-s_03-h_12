import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import type { Paginator } from "../../../core/types/paginator.type.js";
import { buildDbQueryOptions } from "../../../core/utils/build-db-query-options.js";
import { BlogModel } from "../domain/blog.entity.js";
import type { BlogsQueryInput } from "../types/blogs.query.type.js";
import type { BlogView } from "../types/blogs.view.type.js";
import { mapBlogsToPaginatedView } from "./mappers/blogs.entity-list-map.js";
import { mapEntityToViewModel } from "./mappers/blogs.entity-map.js";

@injectable()
export class BlogsQueryRepository {
	async findAll(queryDto: BlogsQueryInput): Promise<Paginator<BlogView>> {
		const { skip, limit, sort } = buildDbQueryOptions(queryDto);
		const searchConditions = [];
		if (queryDto.searchNameTerm) {
			searchConditions.push({
				name: { $regex: queryDto.searchNameTerm, $options: "i" },
			});
		}
		const filter = searchConditions.length ? { $or: searchConditions } : {};

		const items = await BlogModel.find(filter)
			.skip(skip)
			.limit(limit)
			.sort(sort)
			.lean();

		const totalCount = await BlogModel.countDocuments(filter);

		const blogsListOutput = mapBlogsToPaginatedView(items, {
			pageSize: queryDto.pageSize,
			page: queryDto.pageNumber,
			totalCount,
		});

		return blogsListOutput;
	}

	async findOneById(id: string): Promise<BlogView | null> {
		const item = await BlogModel.findOne({ _id: new ObjectId(id) });

		if (!item) {
			return null;
		}

		return mapEntityToViewModel(item);
	}
}
