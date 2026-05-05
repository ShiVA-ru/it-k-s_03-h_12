import type { Express } from "express";
import request from "supertest";
import { RouterPath } from "../../../src/core/constants/router.constants.js";
import { HttpStatus } from "../../../src/core/types/http-statuses.types.js";
import type { BlogInput } from "../../../src/features/blogs/types/blogs.input.type.js";
import type { BlogView } from "../../../src/features/blogs/types/blogs.view.type.js";
import { defaultPostsFilter } from "../../../src/features/posts/constants/posts.default-filter.constants.js";
import type { PostInput } from "../../../src/features/posts/types/posts.input.type.js";
import type { PostView } from "../../../src/features/posts/types/posts.view.type.js";
import { blogsTestManager } from "../utils/blogs.test-manager.js";
import { commonTestManager } from "../utils/common.test-manager.js";
import { postsTestManager } from "../utils/posts.test-manager.js";

describe("tests for /posts", () => {
	let app: Express;
	let createdEntity1: PostView;
	let createdEntity2: PostView;
	let createdBlog: BlogView;
	const adminToken = postsTestManager.adminToken;

	beforeAll(async () => {
		app = await commonTestManager.initApp();
		await request(app).delete(`${RouterPath.testing}/all-data`);

		const blogData: BlogInput = {
			name: "Test Blog",
			description: "Test Blog Description",
			websiteUrl: "https://testblog.com",
		};

		const { createdEntity: blog } = await blogsTestManager.createEntity(
			app,
			blogData,
		);
		createdBlog = blog;

		const data: PostInput = {
			title: "Title",
			shortDescription: "Short Description",
			content: "Content",
			blogId: createdBlog.id,
		};

		const { createdEntity } = await postsTestManager.createEntity(app, data);
		createdEntity1 = createdEntity;
	});

	afterAll(async () => {
		await commonTestManager.closeApp();
	});

	it("shouldn't update entity with empty title field", async () => {
		const data: PostInput = {
			title: "",
			shortDescription: "Short Description",
			content: "Content",
			blogId: createdBlog.id,
		};

		await request(app)
			.put(`${RouterPath.posts}/${createdEntity1.id}`)
			.set("Authorization", adminToken)
			.send(data)
			.expect(HttpStatus.BadRequest);

		await request(app)
			.get(`${RouterPath.posts}/${createdEntity1.id}`)
			.expect(HttpStatus.Ok, createdEntity1);
	});

	it("shouldn't update entity with empty shortDescription field", async () => {
		const data: PostInput = {
			title: "Title1",
			shortDescription: "",
			content: "Content",
			blogId: createdBlog.id,
		};

		await request(app)
			.put(`${RouterPath.posts}/${createdEntity1.id}`)
			.set("Authorization", adminToken)
			.send(data)
			.expect(HttpStatus.BadRequest);

		await request(app)
			.get(`${RouterPath.posts}/${createdEntity1.id}`)
			.expect(HttpStatus.Ok, createdEntity1);
	});

	it("shouldn't update entity with empty content field", async () => {
		const data: PostInput = {
			title: "Title1",
			shortDescription: "Description",
			content: "",
			blogId: createdBlog.id,
		};

		await request(app)
			.put(`${RouterPath.posts}/${createdEntity1.id}`)
			.set("Authorization", adminToken)
			.send(data)
			.expect(HttpStatus.BadRequest);

		await request(app)
			.get(`${RouterPath.posts}/${createdEntity1.id}`)
			.expect(HttpStatus.Ok, createdEntity1);
	});

	it("shouldn update entity with correct data", async () => {
		const data: PostInput = {
			title: "Title1",
			shortDescription: "Description",
			content: "NewContent",
			blogId: createdBlog.id,
		};

		await request(app)
			.put(`${RouterPath.posts}/${createdEntity1.id}`)
			.set("Authorization", adminToken)
			.send(data)
			.expect(HttpStatus.NoContent);

		await request(app)
			.get(`${RouterPath.posts}/${createdEntity1.id}`)
			.expect(HttpStatus.Ok, {...createdEntity1, ...data});
	});
});
