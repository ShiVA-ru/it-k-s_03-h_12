import type { PaginationAndSorting } from "../../../core/types/pagination-and-sorting.type.js";
import type { CommentSortFields } from "./comments.sort-field.type.js";

export type CommentsQueryInput = PaginationAndSorting<CommentSortFields>;
