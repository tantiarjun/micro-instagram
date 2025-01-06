import request from "supertest";
import app from "../src";

describe("User API Tests", () => {
  it("responds with json", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Accept", "application/json");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });
});
