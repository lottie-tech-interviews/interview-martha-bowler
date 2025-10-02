import { OpenAPIHono } from '@hono/zod-openapi';
import { loadData } from "./ignore/load-data";
import { cleanupData } from "./cleanup-data";
import { truncateData } from "./ignore/truncate-data";

const exercise3 = new OpenAPIHono();

exercise3.route("/load-data", loadData);
exercise3.route("/cleanup-data", cleanupData);
exercise3.route("/truncate-data", truncateData);

export { exercise3 };
