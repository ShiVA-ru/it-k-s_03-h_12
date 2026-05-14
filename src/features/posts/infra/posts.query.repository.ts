import { injectable } from "inversify";
import type { Paginator } from "../../../core/types/paginator.type.js";
import { buildDbQueryOptions } from "../../../core/utils/build-db-query-options.js";
import { PostModel } from "../domain/post.entity.js";
import type { PostsQueryInput } from "../types/posts.query.type.js";
import type { PostView } from "../types/posts.view.type.js";
import { mapPostsToPaginatedView } from "./mappers/posts.entity-list-map.js";
import { mapEntityToViewModel } from "./mappers/posts.entity-map.js";
import { PostLikeModel } from "../domain/post-likes.entity.js";
import { UserLikes } from "../types/user-likes.type.js";

@injectable()
export class PostsQueryRepository {
	async findAll(queryDto: PostsQueryInput, userId?: string): Promise<Paginator<PostView>> {
		const { skip, limit, sort } = buildDbQueryOptions(queryDto);
		const filter = {};

		const items = await PostModel.find(filter)
			.skip(skip)
			.limit(limit)
			.sort(sort)
			.lean();

		let userLikes: UserLikes[] = []

		if (userId !== undefined) {
			const postsIdList = items.map(item => item._id.toString());
			console.log('+++++++++++++++++++++++++++++++')
			console.log('postsIdList', postsIdList);
			userLikes = await PostLikeModel.find({
				postId: { $in: postsIdList },
				userId: userId
			}).select('postId status').lean();
			console.log('userLikes', userLikes);
			console.log('+++++++++++++++++++++++++++++++')
		}
		const totalCount = await PostModel.countDocuments(filter);

		return mapPostsToPaginatedView(items, {
			pageSize: queryDto.pageSize,
			page: queryDto.pageNumber,
			totalCount,
		}, userLikes);
	}

	async findOneById(id: string, userId?: string): Promise<PostView | null> {
		const item = await PostModel.findOne({ _id: id });

		if (!item) {
			return null;
		}

		const like = await PostLikeModel.findOne({ userId, postId: id });
		const status = like?.status;

		return mapEntityToViewModel(item, status);
	}

	async findByBlogId(
		blogId: string,
		queryDto: PostsQueryInput,
		userId?: string,
	): Promise<Paginator<PostView>> {
		const { skip, limit, sort } = buildDbQueryOptions(queryDto);

		const filter = { blogId: blogId };

		const [items, totalCount] = await Promise.all([
			PostModel.find(filter).skip(skip).limit(limit).sort(sort).lean(),
			PostModel.countDocuments(filter),
		]);

		let userLikes: UserLikes[] = [];

		if (userId) {
			const postIds = items.map(item => item._id.toString());
			userLikes = await PostLikeModel.find({
				postId: { $in: postIds },
				userId,
			}).select('postId status').lean();
		}

		return mapPostsToPaginatedView(items, {
			pageSize: queryDto.pageSize,
			page: queryDto.pageNumber,
			totalCount,
		}, userLikes);
	}
}
