import express, { type Express } from "express";
import request from "supertest";
import { RouterPath } from "../../../src/core/constants/router.constants.js";
import {
	HttpStatus,
	type HttpStatusType,
} from "../../../src/core/types/http-statuses.types.js";
import type { PostInput } from "../../../src/features/posts/types/posts.input.type.js";
// import { PostView } from "../../../src/features/posts/types/posts.view.type.js";
// import { setupApp } from "../../../src/setup-app.js";
import { commonTestManager } from "./common.test-manager.js";

export const postsTestManager = {
	adminToken: commonTestManager.adminToken,
	async createEntity(
		app: Express,
		data: PostInput,
		expectedStatusCode: HttpStatusType = HttpStatus.Created,
	) {
		const response = await request(app)
			.post(RouterPath.posts)
			.set("Authorization", this.adminToken)
			.send(data)
			.expect(expectedStatusCode);

		let createdEntity: any;

		if (expectedStatusCode === HttpStatus.Created) {
			createdEntity = response.body;

			expect(createdEntity).toEqual({
				id: expect.any(String),
				title: data.title,
				shortDescription: data.shortDescription,
				content: data.content,
				blogId: data.blogId,
				blogName: expect.any(String),
				createdAt: expect.any(String),
			});
		}

		return { response, createdEntity };
	},
};
