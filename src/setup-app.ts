import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import { RouterPath } from "./core/constants/router.constants.js";
import { HttpStatus } from "./core/types/http-statuses.types.js";
import { authRouter } from "./features/auth/api/auth.router.js";
import { blogsRouter } from "./features/blogs/api/blogs.router.js";
import { commentsRouter } from "./features/comments/api/comments.router.js";
import { devicesRouter } from "./features/devices/api/devices.router.js";
import { postsRouter } from "./features/posts/api/posts.router.js";
import { usersRouter } from "./features/users/api/users.router.js";
import { testingRouter } from "./testing/testing.router.js";

export const setupApp = (app: Express) => {
	app.use(express.json());
	app.use(cookieParser());
	app.set("trust proxy", true);

	// основной роут
	app.get("/", (_req, res) => {
		res.status(HttpStatus.Ok).send("Hello world!");
	});

	app.use(RouterPath.blogs, blogsRouter);
	app.use(RouterPath.posts, postsRouter);
	app.use(RouterPath.testing, testingRouter);
	app.use(RouterPath.users, usersRouter);
	app.use(RouterPath.auth, authRouter);
	app.use(RouterPath.comments, commentsRouter);
	app.use(RouterPath.devices, devicesRouter);

	return app;
};
