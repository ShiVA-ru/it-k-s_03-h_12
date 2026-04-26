import { SortDirection } from "../../../core/types/sort-direction.type.js";
import { UserSortFields } from "../types/users.sort-field.type.js";

const DEFAULT_SEARCH_LOGIN_TERM = null;
const DEFAULT_SEARCH_EMAIL_TERM = null;
const DEFAULT_SORT_BY = UserSortFields.CREATED_AT;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

export const defaultUsersFilter = {
	searchLoginTerm: DEFAULT_SEARCH_LOGIN_TERM,
	searchEmailTerm: DEFAULT_SEARCH_EMAIL_TERM,
	sortBy: DEFAULT_SORT_BY,
	sortDirection: DEFAULT_SORT_DIRECTION,
	pageNumber: DEFAULT_PAGE_NUMBER,
	pageSize: DEFAULT_PAGE_SIZE,
};
