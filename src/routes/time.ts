import { Hono } from "hono";

const app = new Hono();

app.get("/now", (c) => {
	const completedAt = new Date(Date.now()).toISOString();
	return c.json({ completedAt });
});

export default app;
