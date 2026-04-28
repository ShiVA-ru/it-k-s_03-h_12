import { query } from "express-validator";
import { SortDirection } from "../../../../core/types/sort-direction.type.js";
import { defaultUsersFilter } from "../../constants/users.default-filter.constants.js";
import { UserSortFields } from "../../types/users.sort-field.type.js";

const sortDirectionValues = Object.values(SortDirection);
const allowedSortFields = Object.values(UserSortFields);

const searchLoginTermValidation = query("searchLoginTerm")
	.trim()
	.isString()
	.withMessage("Search login term must be a string")
	.customSanitizer((value) => {
		return value === "" ? defaultUsersFilter.searchLoginTerm : value;
	});

const searchEmailTermValidation = query("searchEmailTerm")
	.trim()
	.isString()
	.withMessage("Search email term must be a string")
	.customSanitizer((value) => {
		return value === "" ? defaultUsersFilter.searchEmailTerm : value;
	});

const pageNumberValidation = query("pageNumber")
	.default(defaultUsersFilter.pageNumber)
	.isInt({ min: 1 })
	.withMessage("Page number must be a positive integer")
	.toInt();

const pageSizeValidation = query("pageSize")
	.default(defaultUsersFilter.pageSize)
	.isInt({ min: 1, max: 100 })
	.withMessage("Page size must be between 1 and 100")
	.toInt();

const sortByValidation = query("sortBy")
	.default(defaultUsersFilter.sortBy)
	.isIn(allowedSortFields)
	.withMessage(
		`Invalid sort field. Allowed values: ${allowedSortFields.join(", ")}`,
	);

const sortDirectionValidation = query("sortDirection")
	.default(defaultUsersFilter.sortDirection)
	.isIn(sortDirectionValues)
	.withMessage(
		`Sort direction must be one of: ${sortDirectionValues.join(", ")}`,
	);

export const paginationSortingSearchValidation = [
	searchLoginTermValidation,
	searchEmailTermValidation,
	pageNumberValidation,
	pageSizeValidation,
	sortByValidation,
	sortDirectionValidation,
];
