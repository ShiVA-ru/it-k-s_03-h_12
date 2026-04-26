import { type Request, type Response, Router } from "express";
import { HttpStatus } from "../core/types/http-statuses.types.js";
import { RequestModel } from "../db/request.entity.js";
import { BlogModel } from "../features/blogs/domain/blog.entity.js";
import { CommentModel } from "../features/comments/domain/comment.entity.js";
import { DeviceModel } from "../features/devices/domain/device.entity.js";
import { PostModel } from "../features/posts/domain/post.entity.js";
import { UserModel } from "../features/users/domain/user.entity.js";

export const testingRouter = Router();

testingRouter.get("/", (_req: Request, res: Response) => {
	res.status(HttpStatus.Ok).send("testing url");
});

testingRouter.delete("/all-data", async (_req: Request, res: Response) => {
	console.log("deletealldata");
	await PostModel.deleteMany({});
	await BlogModel.deleteMany({});
	await UserModel.deleteMany({});
	await CommentModel.deleteMany({});
	await DeviceModel.deleteMany({});
	await RequestModel.deleteMany({});

	res.sendStatus(HttpStatus.NoContent);
});
