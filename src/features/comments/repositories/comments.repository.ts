import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import {
	type CommentDocument,
	CommentModel,
} from "../domain/comment.entity.js";
// import type { CommentDb } from "../types/comments.db.type.js";
import type { CommentInput } from "../types/comments.input.type.js";

@injectable()
export class CommentsRepository {
	// async create(dto: CommentDb): Promise<string> {
	// 	const result = await CommentModel.insertOne(dto);

	// 	return result._id.toString();
	// }

	async save(comment: CommentDocument): Promise<string> {
		const result = await comment.save();
		return result._id.toString();
	}

	async updateById(id: string, dto: CommentInput): Promise<boolean> {
		const updateResult = await CommentModel.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					content: dto.content,
				},
			},
		);

		if (updateResult.matchedCount < 1) {
			return false;
		}

		return true;
	}

	async deleteOneById(id: string): Promise<boolean> {
		const deleteResult = await CommentModel.deleteOne({
			_id: id,
		});

		if (deleteResult.deletedCount < 1) {
			return false;
		}

		return true;
	}

	async deleteByPostId(blogId: string): Promise<void> {
		const deleteResult = await CommentModel.deleteMany({
			blogId: blogId,
		});

		if (deleteResult.deletedCount < 1) {
			throw new Error("Comment not exist");
		}

		return;
	}

	async findOneById(id: string): Promise<CommentDocument | null> {
		const item = await CommentModel.findOne({ _id: id });

		if (!item) {
			return null;
		}

		return item;
	}
}
