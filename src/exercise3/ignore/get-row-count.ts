import { createRoute, z } from '@hono/zod-openapi';
import { getDatabase, parentRecord, childRecord } from "../database";
import { count } from 'drizzle-orm';

const RowCountResponse = z.object({
    totalRecords: z.number(),
    totalChildren: z.number(),
}).openapi('RowCountResponse');

// GET /cleanup-data/status route to show current state
export const getRowCountRoute = createRoute({
    method: 'get',
    path: '/status',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: RowCountResponse,
                },
            },
            description: 'Current row counts',
        },
    },
    tags: ['exercise3'],
    summary: 'Get row counts',
    description: 'Shows current record counts.',
});

export const getRowCountHandler = async (c: any) => {
    const db = await getDatabase();

    const totalRecords = await db.select({ count: count() })
        .from(parentRecord);

    const totalChildren = await db.select({ count: count() })
        .from(childRecord);

    return c.json({
        totalRecords: totalRecords[0].count,
        totalChildren: totalChildren[0].count,
    });
};
