import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import exercise1 from "./exercise1/welcome";
import time from "./routes/time";
import exercise2 from "./exercise2/lookup";
import generateCsv from "./exercise2/ignore/get-csv";
import { exercise3 } from "./exercise3";
import { port } from "./config";

const app = new OpenAPIHono();

app.use("*", logger());

app.get("/", (c) =>
	c.json({
		name: "coding-ai-interview",
		status: "ok",
		docs: "/docs",
		spec: "/openapi.json",
	}),
);

// OpenAPI spec (Zod OpenAPI) and Swagger UI
app.doc("/openapi.json", {
	openapi: "3.1.0",
	info: { title: "Coding AI Interview API", version: "0.1.0" },
	servers: [{ url: `http://localhost:${port}`, description: "Local" }],
});
app.get("/docs", swaggerUI({ url: "/openapi.json" }));
app.route("/time", time);
app.route("/csv", generateCsv);

app.route("/ex1", exercise1);
app.route("/ex2", exercise2);
app.route("/ex3", exercise3);

console.log(`Server starting on http://localhost:${port}/docs`);

serve({ fetch: app.fetch, port });
