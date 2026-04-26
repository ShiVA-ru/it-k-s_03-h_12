import type { Express } from "express";
import request from "supertest";
import { RouterPath } from "../../../src/core/constants/router.constants.js";
import {
	HttpStatus,
	type HttpStatusType,
} from "../../../src/core/types/http-statuses.types.js";
import type { BlogInput } from "../../../src/features/blogs/types/blogs.input.type.js";
import { commonTestManager } from "./common.test-manager.js";

export const blogsTestManager = {
	adminToken: commonTestManager.adminToken,
	async createEntity(
		app: Express,
		data: BlogInput,
		expectedStatusCode: HttpStatusType = HttpStatus.Created,
	) {
		const response = await request(app)
			.post(RouterPath.blogs)
			.set("Authorization", this.adminToken)
			.send(data)
			.expect(expectedStatusCode);

		let createdEntity: any;

		if (expectedStatusCode === HttpStatus.Created) {
			createdEntity = response.body;

			expect(createdEntity).toEqual({
				id: expect.any(String),
				name: data.name,
				description: data.description,
				websiteUrl: data.websiteUrl,
				createdAt: expect.any(String),
				isMembership: false,
			});
		}

		return { response, createdEntity };
	},
};
