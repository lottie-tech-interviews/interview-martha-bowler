import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { getDatabase, parentRecord, childRecord } from "./database";
import { sql } from 'drizzle-orm';
import { getRowCountRoute, getRowCountHandler } from './ignore/get-row-count';

const cleanupData = new OpenAPIHono();

const CleanupResponse = z.object({
    totalRecordsDeleted: z.number(),
}).openapi('CleanupResponse');


// POST /cleanup-data route
const cleanupDataRoute = createRoute({
    method: 'post',
    path: '/',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: CleanupResponse,
                },
            },
            description: 'Data cleanup result',
        },
    },
    tags: ['exercise3'],
    summary: 'Cleanup data for non-consented users',
    description: 'Deletes all records for users who have not consented. This endpoint is intentionally not optimized for performance testing.',
});

cleanupData.openapi(cleanupDataRoute, async (c) => {

    const db = await getDatabase();

    const consentResult = await db.select({
        id: parentRecord.id,
    })
        .from(parentRecord)
        .where(sql`${parentRecord.hasConsented} = 0`);

    let totalDeleted = 0;

    for (const record of consentResult) {
        const childDeleteResult = await db.delete(childRecord)
            .where(sql`${childRecord.parentId} = ${record.id}`);

        totalDeleted += childDeleteResult.changes || 0;
    }

    for (const record of consentResult) {
        await db.delete(parentRecord).where(sql`${parentRecord.id} = ${record.id}`);
        totalDeleted++;
    }

    return c.json({
        totalRecordsDeleted: totalDeleted,
    });
});

// GET /cleanup-data/status route to show current state
cleanupData.openapi(getRowCountRoute, getRowCountHandler);



export { cleanupData };
