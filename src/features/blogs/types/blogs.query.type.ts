import type { PaginationAndSorting } from "../../../core/types/pagination-and-sorting.type.js";
import type { BlogSortFields } from "./blogs.sort-field.type.js";

export type BlogsQueryInput = PaginationAndSorting<BlogSortFields> & {
	searchNameTerm: string;
};
