import { injectable } from "inversify";
import { type BlogDocument, BlogModel } from "../domain/blog.entity.js";

@injectable()
export class BlogsRepository {
	async save(blog: BlogDocument): Promise<string> {
		const result = await blog.save();
		return result._id.toString();
	}

	async deleteOneById(id: string): Promise<boolean> {
		const deleteResult = await BlogModel.deleteOne({
			_id: id,
		});

		if (deleteResult.deletedCount < 1) {
			return false;
		}

		return true;
	}

	async findOneById(id: string): Promise<BlogDocument | null> {
		const item = await BlogModel.findOne({ _id: id });

		if (!item) {
			return null;
		}

		return item;
	}
}
