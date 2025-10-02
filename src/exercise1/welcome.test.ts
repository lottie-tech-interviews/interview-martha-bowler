import { describe, it, expect } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import exercise1 from "./welcome";

describe("GET /ex1/welcome", () => {
	const app = new OpenAPIHono();
	app.route("/ex1", exercise1);

	it("returns a personalized welcome message using the provided name", async () => {
		const res = await app.request("/ex1/welcome?name=Friend");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toEqual({ message: "Hello Friend" });
	});
});
