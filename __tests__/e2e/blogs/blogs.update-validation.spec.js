import request from "supertest";
import { RouterPath } from "../../../src/core/constants/router.constants.js";
import { HttpStatus } from "../../../src/core/types/http-statuses.types.js";
import { blogsTestManager } from "../utils/blogs.test-manager.js";
import { commonTestManager } from "../utils/common.test-manager.js";
describe("update tests for /blogs", () => {
    let app;
    let createdEntity1;
    // let createdEntity2: BlogView;
    const adminToken = blogsTestManager.adminToken;
    const data1 = {
        name: "Name1",
        description: "string",
        websiteUrl: "https://www.rogaikopyta.com",
    };
    // const data2: BlogInput = {
    //   name: "Name1",
    //   description: "string",
    //   websiteUrl: "https://www.rogaikopyta.com",
    // };
    beforeAll(async () => {
        app = await commonTestManager.initApp();
        await request(app).delete(`${RouterPath.testing}/all-data`);
        const { createdEntity } = await blogsTestManager.createEntity(app, data1);
        createdEntity1 = createdEntity;
        // const { createdEntity: anotherCreatedEntity } =
        //   await blogsTestManager.createEntity(app, data2);
        // createdEntity2 = anotherCreatedEntity;
    });
    afterAll(async () => {
        await commonTestManager.closeApp();
    });
    it("shouldn't update entity with empty name field", async () => {
        const data = {
            name: "",
            description: "descr",
            websiteUrl: "https://www.rogaikopyta.com",
        };
        await request(app)
            .put(`${RouterPath.blogs}/${createdEntity1.id}`)
            .set("Authorization", adminToken)
            .send(data)
            .expect(HttpStatus.BadRequest);
        await request(app)
            .get(`${RouterPath.blogs}/${createdEntity1.id}`)
            .expect(HttpStatus.Ok, createdEntity1);
    });
    it("shouldn't update entity with incorrect name length more than 15", async () => {
        const data = {
            name: "Name1Name1Name1Name1Name1",
            description: "descr",
            websiteUrl: "https://www.rogaikopyta.com",
        };
        await request(app)
            .put(`${RouterPath.blogs}/${createdEntity1.id}`)
            .set("Authorization", adminToken)
            .send(data)
            .expect(HttpStatus.BadRequest);
        await request(app)
            .get(`${RouterPath.blogs}/${createdEntity1.id}`)
            .expect(HttpStatus.Ok, createdEntity1);
    });
    it("shouldn't update entity with incorrect description length less than 1", async () => {
        const data = {
            name: "Name1",
            description: "",
            websiteUrl: "https://www.rogaikopyta.com",
        };
        await request(app)
            .put(`${RouterPath.blogs}/${createdEntity1.id}`)
            .set("Authorization", adminToken)
            .send(data)
            .expect(HttpStatus.BadRequest);
        await request(app)
            .get(`${RouterPath.blogs}/${createdEntity1.id}`)
            .expect(HttpStatus.Ok, createdEntity1);
    });
});
