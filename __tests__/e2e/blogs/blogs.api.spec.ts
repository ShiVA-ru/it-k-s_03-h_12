import type { Express } from "express";
import { ObjectId } from "mongodb";
import request from "supertest";
import { RouterPath } from "../../../src/core/constants/router.constants.js";
import { HttpStatus } from "../../../src/core/types/http-statuses.types.js";
import type { Paginator } from "../../../src/core/types/paginator.type.js";
import { defaultBlogsFilter } from "../../../src/features/blogs/constants/blogs.default-filter.constants.js";
import type { BlogInput } from "../../../src/features/blogs/types/blogs.input.type.js";
import type { BlogView } from "../../../src/features/blogs/types/blogs.view.type.js";
import { blogsTestManager } from "../utils/blogs.test-manager.js";
import { commonTestManager } from "../utils/common.test-manager.js";

describe("api tests for /blogs", () => {
	let app: Express;
	let createdEntity1: BlogView;
	let createdEntity2: BlogView;
	const adminToken = blogsTestManager.adminToken;
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

	it("should return 200 and empty array", async () => {
		await request(app).get(RouterPath.blogs).expect(200, emptyOutputValue);
	});

	it("should return 404 if not existing entity", async () => {
		await request(app).get(`${RouterPath.blogs}/${new ObjectId()}`).expect(404);
	});

	it("should create entity with correct data", async () => {
		const data: BlogInput = {
			name: "Name1",
			description: "string",
			websiteUrl: "https://www.rogaikopyta.com",
		};

		const { createdEntity } = await blogsTestManager.createEntity(app, data);

		createdEntity1 = createdEntity;

		await request(app)
			.get(RouterPath.blogs)
			.expect(200, {
				items: [createdEntity1],
				pagesCount: 1,
				pageSize: defaultBlogsFilter.pageSize,
				totalCount: 1,
				page: defaultBlogsFilter.pageNumber,
			});
	});

	it("should create another entity with correct data", async () => {
		const data: BlogInput = {
			name: "Name1",
			description: "string",
			websiteUrl: "https://www.rogaikopyta.com",
		};

		const { createdEntity } = await blogsTestManager.createEntity(app, data);

		createdEntity2 = createdEntity;

		await request(app)
			.get(RouterPath.blogs)
			.expect(HttpStatus.Ok, {
				items: [createdEntity2, createdEntity1],
				pagesCount: 1,
				pageSize: defaultBlogsFilter.pageSize,
				totalCount: 2,
				page: defaultBlogsFilter.pageNumber,
			});
	});

	it("should delete entity", async () => {
		await request(app)
			.delete(`${RouterPath.blogs}/${createdEntity1.id}`)
			.set("Authorization", adminToken)
			.expect(HttpStatus.NoContent);

		await request(app)
			.get(`${RouterPath.blogs}/${createdEntity1.id}`)
			.expect(HttpStatus.NotFound);

		await request(app)
			.get(`${RouterPath.blogs}/${createdEntity2.id}`)
			.expect(HttpStatus.Ok, createdEntity2);

		await request(app)
			.delete(`${RouterPath.blogs}/${createdEntity2.id}`)
			.set("Authorization", adminToken)
			.expect(HttpStatus.NoContent);

		await request(app)
			.get(`${RouterPath.blogs}/${createdEntity2.id}`)
			.expect(HttpStatus.NotFound);

		await request(app)
			.get(RouterPath.blogs)
			.expect(HttpStatus.Ok, emptyOutputValue);
	});
});
