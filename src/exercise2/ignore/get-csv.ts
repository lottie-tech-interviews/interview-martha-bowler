import { Hono } from "hono";
import { faker } from "@faker-js/faker";

const app = new Hono();

function shuffle<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

app.get("/prices", async (c) => {
	try {
		const count = 5_000_000;
		// Generate CSV content in memory
		const header = "id;ppw";
		let id = 1;
		const entries = Array.from(
			{ length: count },
			() => `${id++};${faker.number.int({ min: 1000, max: 4000 })}`,
		);

		shuffle(entries);
		const csvContent = [header, ...entries].join("\n");

		// Return as file download
		return c.newResponse(csvContent, 200, {
			"Content-Type": "text/csv",
			"Content-Disposition": `attachment; filename="prices.csv"`,
		});
	} catch (error) {
		console.error("Error generating CSV:", error);
		return c.json({ error: "Failed to generate CSV file" }, 500);
	}
});

export default app;
