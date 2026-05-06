import { inject, injectable } from "inversify";
import { BlogModel } from "../domain/blog.entity.js";
import { BlogsRepository } from "../infra/blogs.repository.js";
import type { CreateBlogDto, UpdateBlogDto } from "../types/blog.dto.js";

@injectable()
export class BlogsService {
	constructor(
		@inject(BlogsRepository)
		protected blogsRepository: BlogsRepository,
	) {}

	async create(dto: CreateBlogDto): Promise<string> {
		const blog = BlogModel.createBlog(dto);
		return await this.blogsRepository.save(blog);
	}

	async updateById(dto: UpdateBlogDto): Promise<boolean> {
		const blog = await this.blogsRepository.findOneById(dto.id);

		if (!blog) {
			return false;
		}

		blog.updateBlog(dto);

		const isUpdated = await this.blogsRepository.save(blog);

		if (!isUpdated) {
			return false;
		}

		return true;
	}

	async deleteOneById(id: string): Promise<boolean> {
		return await this.blogsRepository.deleteOneById(id);
	}
}
