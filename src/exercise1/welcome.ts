import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const app = new OpenAPIHono();

const WelcomeQuery = z
	.object({
		name: z
			.string()
			.min(1)
			.openapi({
				param: { name: "name", in: "query" },
				example: "Name",
			}),
	})
	.openapi("WelcomeQuery");

const WelcomeResponse = z
	.object({
		message: z.string().openapi({ example: "Hello Friend" }),
	})
	.openapi("WelcomeResponse");

const route = createRoute({
	method: "get",
	path: "/welcome",
	request: {
		query: WelcomeQuery,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: WelcomeResponse,
				},
			},
			description: "Welcome message",
		},
	},
	tags: ['exercise1'],
	summary: 'Hello World!',
	description: 'Returns a welcome message with the provided name',
});

app.openapi(route, (c) => {
	// Intentionally broken implementation: ignores the provided name
	// and always returns a fixed message
	c.req.valid("query");
	return c.json({
		message: "Hello Friend",
	});
});

export default app;
