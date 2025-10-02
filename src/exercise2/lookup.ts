import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { partnerService } from "./PartnerService";

const app = new OpenAPIHono();

const LookupQuery = z
	.object({
		id: z.coerce
			.number()
			.int()
			.positive()
			.openapi({ param: { name: "id", in: "query" }, example: 10005 }),
	})
	.openapi("LookupQuery");

const LookupResponse = z
	.object({
		id: z.number().int(),
		ppw: z.number(),
	})
	.openapi("LookupResponse");

const route = createRoute({
	method: "get",
	path: "/lookup",
	request: { query: LookupQuery },
	responses: {
		200: {
			description: "Returns the price per week for a carehome",
			content: { "application/json": { schema: LookupResponse } },
		},
		404: { description: "Not found" },
	},
	tags: ['exercise2'],
	summary: 'Lookup prices for a carehome',
	description: 'Returns the price per week for a carehome',
});

app.openapi(route, async (c) => {
	const { id } = c.req.valid("query");

	const found = await partnerService.getPartnerPriceById(id);
	if (!found) return c.body(null, 404);

	return c.json(found);
});

export default app;
