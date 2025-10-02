import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import time from "./time";


describe("GET /time/now", () => {
	const app = new OpenAPIHono();
	app.route("/time", time);

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	// This test has been skipped locally so that it only fails on the CI
	// Remove the skip condition below to run the test locally
	it("should return the current time", async () => {
		const mockDate = new Date('2024-01-01T12:00:00.000Z');
		vi.setSystemTime(mockDate);

		const expected = new Date().toISOString();

		const res = await app.request("/time/now");

		expect(res.status).toBe(200);
		const { completedAt } = (await res.json()) as { completedAt: string };
		expect(completedAt).toBe(expected);
	});
});
