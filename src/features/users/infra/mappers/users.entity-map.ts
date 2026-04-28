import type { WithId } from "mongodb";
import type { User } from "../../domain/user.entity.js";
// import type { UserDb } from "../../types/users.db.type.js";
import type { UserView } from "../../types/users.view.type.js";

export const mapEntityToViewModel = (dbEntity: WithId<User>): UserView => ({
	id: dbEntity._id.toString(),
	login: dbEntity.login,
	email: dbEntity.email,
	createdAt: dbEntity.createdAt.toISOString(),
});
