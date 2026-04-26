import type { PaginationAndSorting } from "../../../core/types/pagination-and-sorting.type.js";
import type { UserSortFields } from "./users.sort-field.type.js";

export type UsersQueryInput = PaginationAndSorting<UserSortFields> & {
	searchLoginTerm: string;
	searchEmailTerm: string;
};
