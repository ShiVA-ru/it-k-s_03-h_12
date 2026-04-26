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
    // const adminToken = postsTestManager.adminToken;
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
    // it("shouldn't update entity with incorrect title length less than 1", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "",
    //     author: "New Author",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 12,
    //     publicationDate: new Date().toISOString(),
    //     availableResolutions: [VideoResolutions.P1080, VideoResolutions.P1440],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .send(data)
    //     .expect(HttpStatus.BadRequest);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.Ok, createdEntity1);
    // });
    // it("shouldn't update entity with incorrect title length more than 40", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "videovideovideovideovideovideovideovideovideovideo",
    //     author: "New Author",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 12,
    //     publicationDate: new Date().toISOString(),
    //     availableResolutions: [VideoResolutions.P1080, VideoResolutions.P1440],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .send(data)
    //     .expect(HttpStatus.BadRequest);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.Ok, createdEntity1);
    // });
    // it("shouldn't update entity with incorrect author length less than 1", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "video",
    //     author: "",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 12,
    //     publicationDate: new Date().toISOString(),
    //     availableResolutions: [VideoResolutions.P1080, VideoResolutions.P1440],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .send(data)
    //     .expect(HttpStatus.BadRequest);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.Ok, createdEntity1);
    // });
    // it("shouldn't update entity with incorrect author length more than 20", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "video",
    //     author: "AuthorAuthorAuthorAuthor",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 12,
    //     publicationDate: new Date().toISOString(),
    //     availableResolutions: [VideoResolutions.P1080, VideoResolutions.P1440],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .send(data)
    //     .expect(HttpStatus.BadRequest);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.Ok, createdEntity1);
    // });
    // it("shouldn't update entity with incorrect minAgeRestriction less than 1", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "video",
    //     author: "Author",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 0,
    //     publicationDate: new Date().toISOString(),
    //     availableResolutions: [VideoResolutions.P1080, VideoResolutions.P1440],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .send(data)
    //     .expect(HttpStatus.BadRequest);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.Ok, createdEntity1);
    // });
    // it("shouldn't update entity with incorrect minAgeRestriction more than 18", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "video",
    //     author: "Author",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 20,
    //     publicationDate: new Date().toISOString(),
    //     availableResolutions: [VideoResolutions.P1080, VideoResolutions.P1440],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .send(data)
    //     .expect(HttpStatus.BadRequest);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.Ok, createdEntity1);
    // });
    // it("shouldn't update entity with incorrect publicationDate", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "video",
    //     author: "Author",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 15,
    //     publicationDate: "dfsdf",
    //     availableResolutions: [VideoResolutions.P1080, VideoResolutions.P1440],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .send(data)
    //     .expect(HttpStatus.BadRequest);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.Ok, createdEntity1);
    // });
    // it("shouldn't update entity with incorrect availableResolutions length less than 1", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "video",
    //     author: "Author",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 15,
    //     publicationDate: new Date().toISOString(),
    //     availableResolutions: [],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .send(data)
    //     .expect(HttpStatus.BadRequest);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.Ok, createdEntity1);
    // });
    // it("shouldn't update entity that not exist", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "Title",
    //     author: "New Author",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 12,
    //     publicationDate: new Date().toISOString(),
    //     availableResolutions: [VideoResolutions.P1080, VideoResolutions.P1440],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/123`)
    //     .send(data)
    //     .expect(HttpStatus.NotFound);
    // });
    // it("should update entity with correct input data", async () => {
    //   const data: UpdateVideoModel = {
    //     title: "Title",
    //     author: "New Author",
    //     canBeDownloaded: true,
    //     minAgeRestriction: 12,
    //     publicationDate: new Date().toISOString(),
    //     availableResolutions: [VideoResolutions.P1080, VideoResolutions.P1440],
    //   };
    //   await request(app)
    //     .put(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .send(data)
    //     .expect(HttpStatus.NoContent);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.Ok, { ...createdEntity1, ...data });
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity2.id}`)
    //     .expect(HttpStatus.Ok, createdEntity2);
    // });
    // it("should delete entity", async () => {
    //   await request(app)
    //     .delete(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.NoContent);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity1.id}`)
    //     .expect(HttpStatus.NotFound);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity2.id}`)
    //     .expect(HttpStatus.Ok, createdEntity2);
    //   await request(app)
    //     .delete(`${RouterPath.posts}/${createdEntity2.id}`)
    //     .expect(HttpStatus.NoContent);
    //   await request(app)
    //     .get(`${RouterPath.posts}/${createdEntity2.id}`)
    //     .expect(HttpStatus.NotFound);
    //   await request(app).get(RouterPath.posts).expect(HttpStatus.Ok, []);
    // });
});
