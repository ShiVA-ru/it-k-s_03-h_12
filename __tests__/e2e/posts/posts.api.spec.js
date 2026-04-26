import { ObjectId } from "mongodb";
import request from "supertest";
import { RouterPath } from "../../../src/core/constants/router.constants.js";
import { HttpStatus } from "../../../src/core/types/http-statuses.types.js";
import { defaultPostsFilter } from "../../../src/features/posts/constants/posts.default-filter.constants.js";
import { blogsTestManager } from "../utils/blogs.test-manager.js";
import { commonTestManager } from "../utils/common.test-manager.js";
import { postsTestManager } from "../utils/posts.test-manager.js";
describe("tests for /posts", () => {
    let app;
    let createdEntity1;
    let createdEntity2;
    let createdBlog;
    const adminToken = postsTestManager.adminToken;
    const emptyOutputValue = {
        items: [],
        pagesCount: 0,
        pageSize: defaultPostsFilter.pageSize,
        totalCount: 0,
        page: 1,
    };
    beforeAll(async () => {
        app = await commonTestManager.initApp();
        await request(app).delete(`${RouterPath.testing}/all-data`);
        const blogData = {
            name: "Test Blog",
            description: "Test Blog Description",
            websiteUrl: "https://testblog.com",
        };
        const { createdEntity: blog } = await blogsTestManager.createEntity(app, blogData);
        createdBlog = blog;
    });
    afterAll(async () => {
        await commonTestManager.closeApp();
    });
    it("should return 200 and empty array", async () => {
        await request(app).get(RouterPath.posts).expect(200, emptyOutputValue);
    });
    it("should return 404 if not existing entity", async () => {
        await request(app).get(`${RouterPath.posts}/${new ObjectId()}`).expect(404);
    });
    it("should create entity with correct data", async () => {
        const data = {
            title: "Title",
            shortDescription: "Short Description",
            content: "Content",
            blogId: createdBlog.id,
        };
        const { createdEntity } = await postsTestManager.createEntity(app, data);
        createdEntity1 = createdEntity;
        await request(app)
            .get(RouterPath.posts)
            .expect(200, {
            items: [createdEntity1],
            pagesCount: 1,
            pageSize: defaultPostsFilter.pageSize,
            totalCount: 1,
            page: 1,
        });
    });
    it("should create another entity with correct data", async () => {
        const data = {
            title: "Title 2",
            shortDescription: "Short Description 2",
            content: "Content 2",
            blogId: createdBlog.id,
        };
        const { createdEntity } = await postsTestManager.createEntity(app, data);
        createdEntity2 = createdEntity;
        await request(app)
            .get(RouterPath.posts)
            .expect(HttpStatus.Ok, {
            items: [createdEntity2, createdEntity1],
            pagesCount: 1,
            pageSize: defaultPostsFilter.pageSize,
            totalCount: 2,
            page: 1,
        });
    });
    it("should delete entity", async () => {
        await request(app)
            .delete(`${RouterPath.posts}/${createdEntity1.id}`)
            .set("Authorization", adminToken)
            .expect(HttpStatus.NoContent);
        await request(app)
            .get(`${RouterPath.posts}/${createdEntity1.id}`)
            .expect(HttpStatus.NotFound);
        await request(app)
            .get(`${RouterPath.posts}/${createdEntity2.id}`)
            .expect(HttpStatus.Ok, createdEntity2);
        await request(app)
            .delete(`${RouterPath.posts}/${createdEntity2.id}`)
            .set("Authorization", adminToken)
            .expect(HttpStatus.NoContent);
        await request(app)
            .get(`${RouterPath.posts}/${createdEntity2.id}`)
            .expect(HttpStatus.NotFound);
        await request(app)
            .get(RouterPath.posts)
            .expect(HttpStatus.Ok, emptyOutputValue);
    });
});
