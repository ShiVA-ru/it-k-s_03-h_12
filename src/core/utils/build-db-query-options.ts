import type { SortDirection } from "../types/sort-direction.type.js";

export type DbOptions = {
	skip: number;
	limit: number;
	sort: Record<string, 1 | -1>;
};

export type QueryDto = {
	pageNumber: number;
	pageSize: number;
	sortBy: string;
	sortDirection: SortDirection;
};

export const buildDbQueryOptions = (queryDto: QueryDto): DbOptions => {
	const skip = (queryDto.pageNumber - 1) * queryDto.pageSize;
	const limit = queryDto.pageSize;
	const sort: Record<string, 1 | -1> = {
		[queryDto.sortBy]: queryDto.sortDirection === "asc" ? 1 : -1,
	};

	return { skip, limit, sort };
};
