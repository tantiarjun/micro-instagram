import request from "supertest";
import app from "../src";

describe("Post API Tests", () => {
  describe("GET /post", () => {
    it("should return the details of a post", async () => {
      const response = await request(app)
        .get("/api/post")
        .set("Accept", "application/json");
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
    });
  });

  describe("POST /post", () => {
    it("should create a new post", async () => {
      const response = await request(app)
        .post("/api/post")
        .field("title", "Sample Post")
        .attach("images", "__tests__/fixtures/sample-image.jpg") // Replace with a valid path to a sample image
        .set("Accept", "application/json");
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(201);
    });
  });

  describe("GET /user/:userid/posts", () => {
    it("should return all posts for a user", async () => {
      const response = await request(app)
        .get("/api/user/4/posts")
        .set("Accept", "application/json");
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
    });
  });

  describe("PUT /post/:id", () => {
    it("should update an existing post", async () => {
      const response = await request(app)
        .put("/api/post/4")
        .field("title", "Updated Post Title")
        .attach("images", "__tests__/fixtures/updated-image.jpg")
        .set("Accept", "application/json");
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
    });
  });

  describe("DELETE /post/:id", () => {
    it("should delete a post by ID", async () => {
      const response = await request(app)
        .delete("/api/post/5")
        .set("Accept", "application/json");
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(200);
    });
  });
});
