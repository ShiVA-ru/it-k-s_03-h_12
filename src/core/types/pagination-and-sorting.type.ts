import type { SortDirection } from "./sort-direction.type.js";

export type PaginationAndSorting<T> = {
	pageNumber: number;
	pageSize: number;
	sortBy: T;
	sortDirection: SortDirection;
};
