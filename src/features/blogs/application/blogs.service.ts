import { inject, injectable } from "inversify";
import { BlogModel } from "../domain/blog.entity.js";
import { BlogsRepository } from "../infra/blogs.repository.js";
import type { BlogInput } from "../types/blogs.input.type.js";

@injectable()
export class BlogsService {
	constructor(
		@inject(BlogsRepository)
		protected blogsRepository: BlogsRepository,
	) {}

	async create(dto: BlogInput): Promise<string> {
		const blog = BlogModel.create(dto);

		return await this.blogsRepository.save(blog);
	}

	async updateById(id: string, dto: BlogInput): Promise<boolean> {
		const blog = await this.blogsRepository.findOneById(id);

		if (!blog) {
			return false;
		}

		blog.name = dto.name;
		blog.description = dto.description;
		blog.websiteUrl = dto.websiteUrl;

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
