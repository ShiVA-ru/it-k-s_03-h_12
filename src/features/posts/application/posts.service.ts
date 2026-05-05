import { inject, injectable } from "inversify";
import { BlogsRepository } from "../../blogs/infra/blogs.repository.js";
import { PostModel } from "../domain/post.entity.js";
import { PostsRepository } from "../infra/posts.repository.js";
import type { PostInput } from "../types/posts.input.type.js";

@injectable()
export class PostsService {
	constructor(
		@inject(PostsRepository)
		protected postsRepository: PostsRepository,
		@inject(BlogsRepository)
		protected blogsRepository: BlogsRepository,
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
}
