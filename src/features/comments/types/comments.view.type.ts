import type { CommentatorInfoType } from "./comments.commentator-info.type.js";
import {LikesView} from "./likes-status.view.type.js";

export type CommentView = {
	id: string;
	content: string;
	commentatorInfo: CommentatorInfoType;
	createdAt?: string;
	likesInfo: LikesView;
};
