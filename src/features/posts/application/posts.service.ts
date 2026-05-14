import { inject, injectable } from "inversify";
import { BlogsRepository } from "../../blogs/infra/blogs.repository.js";
import { PostModel } from "../domain/post.entity.js";
import { PostsRepository } from "../infra/posts.repository.js";
import type { PostInput } from "../types/posts.input.type.js";
import { LikeStatus } from "../../../core/types/like-status.type.js";
import type { Result } from "../../../core/types/result.type.js";
import { ResultStatus } from "../../../core/types/result.code.js";
import { PostsLikesRepository } from "../infra/posts-likes.repository.js";
import { PostLikeModel } from "../domain/post-likes.entity.js";
import { UsersRepository } from "../../users/infra/users.repository.js";

@injectable()
export class PostsService {
	constructor(
		@inject(PostsRepository)
		protected postsRepository: PostsRepository,
		@inject(BlogsRepository)
		protected blogsRepository: BlogsRepository,
		@inject(PostsLikesRepository)
		protected postsLikesRepository: PostsLikesRepository,
		@inject(UsersRepository)
		protected usersRepository: UsersRepository,
	) {}

	async create(dto: PostInput): Promise<string | null> {
		const blogEntity = await this.blogsRepository.findOneById(dto.blogId);

		if (!blogEntity) {
			return null;
		}

		const post = PostModel.createPost(dto, blogEntity.name);

		const postId = await this.postsRepository.save(post);

		return postId;
	}

	async updateById(
		id: string,
		dto: PostInput,
	): Promise<{ notFound: boolean; entity: "post" | "blog" | null }> {
		const blogEntity = await this.blogsRepository.findOneById(dto.blogId);

		if (!blogEntity) {
			return { notFound: true, entity: "blog" };
		}

		const post = await this.postsRepository.findOneById(id);

		if (!post) {
			return { notFound: true, entity: "post" };
		}

		post.updatePost({
			id,
			...dto,
			blogName: blogEntity.name
		});

		const isUpdated = await this.postsRepository.save(post);

		if (!isUpdated) {
			return { notFound: true, entity: "post" };
		}

		return { notFound: false, entity: null };
	}

	async deleteOneById(id: string): Promise<boolean> {
		return await this.postsRepository.deleteOneById(id);
	}

	async setLikeStatus(
		userId: string,
		postId: string,
		status: LikeStatus,
	): Promise<Result<true>> {
		const post = await this.postsRepository.findOneById(postId);

		if (!post) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "post not found",
				extensions: [],
				data: null,
			};
		}

		const user = await this.usersRepository.findOneById(userId);

		if (!user) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "user not found",
				extensions: [],
				data: null,
			};
		}

		let like = await this.postsLikesRepository.findOneById(userId, postId);

		if (!like) {
			like = PostLikeModel.createPostLike({ postId, userId, status, login: user.login })
		} else {
			console.log('!!!!!!!!!!!!!!!!!!!!!!!')
			console.log('exists like before update', like)
			like.updateStatus({ status })
			console.log('exists like after update', like)
			console.log('!!!!!!!!!!!!!!!!!!!!!!!')
		}

		await this.postsLikesRepository.save(like);

		const [likesCount, dislikesCount, newestLikes] = await Promise.all([
			this.postsLikesRepository.findLikesByStatus(postId, LikeStatus.Like),
			this.postsLikesRepository.findLikesByStatus(postId, LikeStatus.Dislike),
			this.postsLikesRepository.findNewestLikes(postId)
		])
		// console.log('===============================')
		// console.log('status', status)
		// console.log('like', like)
		// console.log('likesCount', likesCount)
		// console.log('dislikesCount', dislikesCount)
		// console.log('newestLikes', newestLikes)

		post.updateLikeInfo({ likesCount, dislikesCount, newestLikes });

		await this.postsRepository.save(post);

		// console.log('setLikeStatus', post);
		// console.log('setLikeStatus', post.extendedLikesInfo);
		// console.log('===================================')

		return {
			status: ResultStatus.Success,
			extensions: [],
			data: true,
		};
	}
}
