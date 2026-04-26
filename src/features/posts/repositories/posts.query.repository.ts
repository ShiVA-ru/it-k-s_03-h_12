import {injectable} from "inversify";
import type {Paginator} from "../../../core/types/paginator.type.js";
import {buildDbQueryOptions} from "../../../core/utils/build-db-query-options.js";
import {PostModel} from "../domain/post.entity.js";
import type {PostsQueryInput} from "../types/posts.query.type.js";
import type {PostView} from "../types/posts.view.type.js";
import {mapPostsToPaginatedView} from "./mappers/posts.entity-list-map.js";
import {mapEntityToViewModel} from "./mappers/posts.entity-map.js";

@injectable()
export class PostsQueryRepository {
	async findAll(queryDto: PostsQueryInput): Promise<Paginator<PostView>> {
		const { skip, limit, sort } = buildDbQueryOptions(queryDto);
		const filter = {};

		const items = await PostModel.find(filter)
			.skip(skip)
			.limit(limit)
			.sort(sort)
			.lean();

		const totalCount = await PostModel.countDocuments(filter);

		return mapPostsToPaginatedView(items, {
			pageSize: queryDto.pageSize,
			page: queryDto.pageNumber,
			totalCount,
		});
	}

	async findOneById(id: string): Promise<PostView | null> {
		const item = await PostModel.findOne({ _id: id });

		if (!item) {
			return null;
		}

		return mapEntityToViewModel(item);
	}

	async findByBlogId(
		blogId: string,
		queryDto: PostsQueryInput,
	): Promise<Paginator<PostView>> {
		const { skip, limit, sort } = buildDbQueryOptions(queryDto);

		const filter = { blogId: blogId };

		const items = await PostModel.find(filter)
			.skip(skip)
			.limit(limit)
			.sort(sort)
			.lean();

		const totalCount = await PostModel.countDocuments(filter);

		return mapPostsToPaginatedView(items, {
			pageSize: queryDto.pageSize,
			page: queryDto.pageNumber,
			totalCount,
		});
	}
}
