import { injectable } from "inversify";
import { type PostDocument, PostModel } from "../domain/post.entity.js";
import type { PostDb } from "../types/posts.db.type.js";

@injectable()
export class PostsRepository {
	async save(post: PostDocument): Promise<string> {
		const result = await post.save();
		return result._id.toString();
	}

	async updateById(
		id: string,
		dto: Omit<PostDb, "createdAt">,
	): Promise<boolean> {
		const updateResult = await PostModel.updateOne(
			{ _id: id },
			{
				$set: {
					title: dto.title,
					shortDescription: dto.shortDescription,
					content: dto.content,
					blogId: dto.blogId,
					blogName: dto.blogName,
				},
			},
		);

		if (updateResult.matchedCount < 1) {
			return false;
		}

		return true;
	}

	async deleteOneById(id: string): Promise<boolean> {
		const deleteResult = await PostModel.deleteOne({
			_id: id,
		});

		if (deleteResult.deletedCount < 1) {
			return false;
		}

		return true;
	}

	async deleteByBlogId(blogId: string): Promise<void> {
		const deleteResult = await PostModel.deleteMany({
			blogId: blogId,
		});

		if (deleteResult.deletedCount < 1) {
			throw new Error("Post not exist");
		}

		return;
	}

	async findOneById(id: string): Promise<PostDocument | null> {
		const item = await PostModel.findOne({ _id: id });

		if (!item) {
			return null;
		}

		return item;
	}
}
