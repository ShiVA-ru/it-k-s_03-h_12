import type {CommentatorInfoType} from "../types/comments.commentator-info.type.js";

export class CreateCommentDto {
    constructor(
        public content: string,
        public postId: string,
        public commentatorInfo: CommentatorInfoType,
    ) {}
}