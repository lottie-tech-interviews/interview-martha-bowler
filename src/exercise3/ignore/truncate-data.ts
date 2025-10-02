import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { getDatabase, parentRecord, childRecord } from "../database";
import { count } from 'drizzle-orm';

const truncateData = new OpenAPIHono();

const TruncateResponse = z.object({
    totalRecordsDeleted: z.number(),
    message: z.string(),
}).openapi('TruncateResponse');

// POST /truncate-data route to delete all records
const truncateDataRoute = createRoute({
    method: 'post',
    path: '/',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: TruncateResponse,
                },
            },
            description: 'Data truncation result',
        },
    },
    tags: ['exercise3'],
    summary: 'Truncate all data',
    description: 'Deletes all records from the data table. This is a destructive operation that will remove all data.',
});

truncateData.openapi(truncateDataRoute, async (c) => {
    const db = await getDatabase();

    // Get count before deletion for response
    const totalRecords = await db.select({ count: count() })
        .from(parentRecord);

    const totalChildren = await db.select({ count: count() })
        .from(childRecord);

    const countBefore = totalRecords[0].count;
    const childCountBefore = totalChildren[0].count;

    // Delete all records (children first due to foreign key constraint)
    await db.delete(childRecord);
    await db.delete(parentRecord);

    return c.json({
        totalRecordsDeleted: countBefore + childCountBefore,
        message: 'All data has been truncated successfully',
    });
});

export { truncateData };
