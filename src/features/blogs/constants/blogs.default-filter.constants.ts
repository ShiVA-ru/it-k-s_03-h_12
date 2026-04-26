import { SortDirection } from "../../../core/types/sort-direction.type.js";
import { BlogSortFields } from "../types/blogs.sort-field.type.js";

const DEFAULT_SEARCH_TERM = null;
const DEFAULT_SORT_BY = BlogSortFields.CREATED_AT;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

export const defaultBlogsFilter = {
	searchTerm: DEFAULT_SEARCH_TERM,
	sortBy: DEFAULT_SORT_BY,
	sortDirection: DEFAULT_SORT_DIRECTION,
	pageNumber: DEFAULT_PAGE_NUMBER,
	pageSize: DEFAULT_PAGE_SIZE,
};
