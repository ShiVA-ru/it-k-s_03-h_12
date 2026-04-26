import {LikeStatus} from "../domain/comment.entity.js";

export type LikesView = {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
}