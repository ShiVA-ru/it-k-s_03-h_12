import type { CommentatorInfoType } from "./comments.commentator-info.type.js";

export class CommentDb {
	public createdAt: string;

	constructor(
		public content: string,
		public commentatorInfo: CommentatorInfoType,
		public postId: string,
	) {
		this.createdAt = new Date().toISOString();
	}
}
