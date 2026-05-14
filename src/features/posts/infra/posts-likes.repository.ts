import { injectable } from "inversify";
import { PostLikeDocument, PostLikeModel } from "../domain/post-likes.entity.js";
import { LikeStatus } from "../../../core/types/like-status.type.js";
import { NewestLike } from "../domain/post.entity.js";

@injectable()
export class PostsLikesRepository {
	async save(like: PostLikeDocument): Promise<string> {
		const result = await like.save();
		return result._id.toString();
	}

	async findOneById(userId: string, postId: string): Promise<PostLikeDocument | null> {
		return PostLikeModel.findOne({ userId, postId });
	}

	async findNewestLikes(postId: string): Promise<NewestLike[]> {
		return PostLikeModel.find({ postId, status: LikeStatus.Like }).sort({ addedAt: 'desc' }).limit(3).lean();
	}

	async findLikesByStatus(postId: string, status: LikeStatus): Promise<number> {
		return PostLikeModel.countDocuments({ postId, status });
	}
}
