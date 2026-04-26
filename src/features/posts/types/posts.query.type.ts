import type { PaginationAndSorting } from "../../../core/types/pagination-and-sorting.type.js";
import type { PostSortFields } from "./posts.sort-field.type.js";

export type PostsQueryInput = PaginationAndSorting<PostSortFields>;
