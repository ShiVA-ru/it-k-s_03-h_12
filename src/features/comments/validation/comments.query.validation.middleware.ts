import { query } from "express-validator";
import { SortDirection } from "../../../core/types/sort-direction.type.js";
import { defaultPostsFilter } from "../constants/comments.default-filter.constants.js";
import { CommentSortFields } from "../types/comments.sort-field.type.js";

const sortDirectionValues = Object.values(SortDirection);
const allowedSortFields = Object.values(CommentSortFields);

const pageNumberValidation = query("pageNumber")
	.default(defaultPostsFilter.pageNumber)
	.isInt({ min: 1 })
	.withMessage("Page number must be a positive integer")
	.toInt();

const pageSizeValidation = query("pageSize")
	.default(defaultPostsFilter.pageSize)
	.isInt({ min: 1, max: 100 })
	.withMessage("Page size must be between 1 and 100")
	.toInt();

const sortByValidation = query("sortBy")
	.default(defaultPostsFilter.sortBy)
	.isIn(allowedSortFields)
	.withMessage(
		`Invalid sort field. Allowed values: ${allowedSortFields.join(", ")}`,
	);

const sortDirectionValidation = query("sortDirection")
	.default(defaultPostsFilter.sortDirection)
	.isIn(sortDirectionValues)
	.withMessage(
		`Sort direction must be one of: ${sortDirectionValues.join(", ")}`,
	);

export const paginationSortingValidation = [
	pageNumberValidation,
	pageSizeValidation,
	sortByValidation,
	sortDirectionValidation,
];
