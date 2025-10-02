import { describe, it, expect } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import time from "./time";


describe("GET /time/now", () => {
	const app = new OpenAPIHono();
	app.route("/time", time);

	// This test has been skipped locally so that it only fails on the CI
	// Remove the skip condition below to run the test locally
	it("should return the current time", { skip: !process.env.CI }, async () => {

		const expected = new Date().toISOString();

		const res = await app.request("/time/now");

		expect(res.status).toBe(200);
		const { completedAt } = (await res.json()) as { completedAt: string };
		expect(completedAt).toBe(expected);
	});
});
