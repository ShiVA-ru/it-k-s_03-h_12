import type { WithId } from "mongodb";
import type { Paginator } from "../../../../core/types/paginator.type.js";
import type { User } from "../../domain/user.entity.js";
// import type { UserDb } from "../../types/users.db.type.js";
import type { UserView } from "../../types/users.view.type.js";
import { mapEntityToViewModel } from "./users.entity-map.js";

export const mapUsersToPaginatedView = (
	dbEntities: WithId<User>[],
	meta: {
		page: number;
		pageSize: number;
		totalCount: number;
	},
): Paginator<UserView> => {
	const pagesCount = Math.ceil(meta.totalCount / meta.pageSize);

	const mappedUsers = dbEntities.map(mapEntityToViewModel);

	return {
		items: mappedUsers,
		pagesCount,
		page: meta.page,
		pageSize: meta.pageSize,
		totalCount: meta.totalCount,
	};
};
