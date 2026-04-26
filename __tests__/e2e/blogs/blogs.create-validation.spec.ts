import type { Express } from "express";
import request from "supertest";
import { RouterPath } from "../../../src/core/constants/router.constants.js";
import { HttpStatus } from "../../../src/core/types/http-statuses.types.js";
import type { Paginator } from "../../../src/core/types/paginator.type.js";
import { defaultBlogsFilter } from "../../../src/features/blogs/constants/blogs.default-filter.constants.js";
import type { BlogInput } from "../../../src/features/blogs/types/blogs.input.type.js";
import type { BlogView } from "../../../src/features/blogs/types/blogs.view.type.js";
import { blogsTestManager } from "../utils/blogs.test-manager.js";
import { commonTestManager } from "../utils/common.test-manager.js";

describe("create tests for /blogs", () => {
	let app: Express;
	const emptyOutputValue: Paginator<BlogView> = {
		items: [],
		pagesCount: 0,
		pageSize: defaultBlogsFilter.pageSize,
		totalCount: 0,
		page: 1,
	};

	beforeAll(async () => {
		app = await commonTestManager.initApp();
		await request(app).delete(`${RouterPath.testing}/all-data`);
	});

	afterAll(async () => {
		await commonTestManager.closeApp();
	});

	it("shouldn't create entity with empty name field", async () => {
		const data: BlogInput = {
			name: "",
			description: "string",
			websiteUrl: "https://www.rogaikopyta.com",
		};

		await blogsTestManager.createEntity(app, data, HttpStatus.BadRequest);

		await request(app)
			.get(RouterPath.blogs)
			.expect(HttpStatus.Ok, emptyOutputValue);
	});

	it("shouldn't create entity with name field more than 15", async () => {
		const data: BlogInput = {
			name: "Name1Name1Name1Name1",
			description: "string",
			websiteUrl: "https://www.rogaikopyta.com",
		};

		await blogsTestManager.createEntity(app, data, HttpStatus.BadRequest);

		await request(app)
			.get(RouterPath.blogs)
			.expect(HttpStatus.Ok, emptyOutputValue);
	});

	it("shouldn't create entity with empty description field", async () => {
		const data: BlogInput = {
			name: "Name1",
			description: "",
			websiteUrl: "https://www.rogaikopyta.com",
		};

		await blogsTestManager.createEntity(app, data, HttpStatus.BadRequest);

		await request(app)
			.get(RouterPath.blogs)
			.expect(HttpStatus.Ok, emptyOutputValue);
	});

	it("shouldn't create entity with empty websiteUrl field", async () => {
		const data: BlogInput = {
			name: "Name1",
			description: "descr",
			websiteUrl: "",
		};

		await blogsTestManager.createEntity(app, data, HttpStatus.BadRequest);

		await request(app)
			.get(RouterPath.blogs)
			.expect(HttpStatus.Ok, emptyOutputValue);
	});

	it("shouldn't create entity with incorrect websiteUrl field - http protocol", async () => {
		const data: BlogInput = {
			name: "Name1",
			description: "descr",
			websiteUrl: "http://www.rogaikopyta.com",
		};

		await blogsTestManager.createEntity(app, data, HttpStatus.BadRequest);

		await request(app)
			.get(RouterPath.blogs)
			.expect(HttpStatus.Ok, emptyOutputValue);
	});

	it("shouldn't create entity with incorrect websiteUrl field - no slashes", async () => {
		const data: BlogInput = {
			name: "Name1",
			description: "descr",
			websiteUrl: "http:www.rogaikopyta.com",
		};

		await blogsTestManager.createEntity(app, data, HttpStatus.BadRequest);

		await request(app)
			.get(RouterPath.blogs)
			.expect(HttpStatus.Ok, emptyOutputValue);
	});
});
