import { query } from "express-validator";
import { SortDirection } from "../../../../core/types/sort-direction.type.js";
import { defaultBlogsFilter } from "../../constants/blogs.default-filter.constants.js";
import { BlogSortFields } from "../../types/blogs.sort-field.type.js";

const sortDirectionValues = Object.values(SortDirection);
const allowedSortFields = Object.values(BlogSortFields);

const searchNameTermValidation = query("searchNameTerm")
	.trim()
	.isString()
	.withMessage("Search name term must be a string")
	.customSanitizer((value) => {
		return value === "" ? defaultBlogsFilter.searchTerm : value;
	});

const pageNumberValidation = query("pageNumber")
	.default(defaultBlogsFilter.pageNumber)
	.isInt({ min: 1 })
	.withMessage("Page number must be a positive integer")
	.toInt();

const pageSizeValidation = query("pageSize")
	.default(defaultBlogsFilter.pageSize)
	.isInt({ min: 1, max: 100 })
	.withMessage("Page size must be between 1 and 100")
	.toInt();

const sortByValidation = query("sortBy")
	.default(defaultBlogsFilter.sortBy)
	.isIn(allowedSortFields)
	.withMessage(
		`Invalid sort field. Allowed values: ${allowedSortFields.join(", ")}`,
	);

const sortDirectionValidation = query("sortDirection")
	.default(defaultBlogsFilter.sortDirection)
	.isIn(sortDirectionValues)
	.withMessage(
		`Sort direction must be one of: ${sortDirectionValues.join(", ")}`,
	);

export const paginationSortingSearchValidation = [
	searchNameTermValidation,
	pageNumberValidation,
	pageSizeValidation,
	sortByValidation,
	sortDirectionValidation,
];
