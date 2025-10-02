import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { faker } from "@faker-js/faker";
import { getDatabase, parentRecord, childRecord } from "../database";

const loadData = new OpenAPIHono();

// Response schemas
const SeedingResponse = z.object({
    message: z.string(),
    recordsCreated: z.number().optional(),
    existingCount: z.number().optional(),
    status: z.enum(['completed', 'skipped']),
}).openapi('SeedingResponse');

const ErrorResponse = z.object({
    error: z.string(),
    details: z.string(),
}).openapi('ErrorResponse');

// POST /load-data route
const seedDataRoute = createRoute({
    method: 'post',
    path: '/',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: SeedingResponse,
                },
            },
            description: 'Database seeding result',
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponse,
                },
            },
            description: 'Internal server error',
        },
    },
    tags: ['exercise3'],
    summary: 'Seed database with sample data',
    description: 'Generates and inserts 100,000 sample records into the database. If data already exists, returns existing count.',
});

loadData.openapi(seedDataRoute, async (c) => {
    try {
        const db = await getDatabase();

        // Check if data already exists
        const existingCount = await db.select({ count: parentRecord.id }).from(parentRecord);
        if (existingCount.length > 0) {
            return c.json({
                message: "Database already seeded",
                existingCount: existingCount.length,
                status: "skipped" as const
            }, 200);
        }

        // Generate 10k records in batches
        const batchSize = 1000;
        const totalRecords = 10000;
        const batches = Math.ceil(totalRecords / batchSize);

        console.log(`Starting to seed ${totalRecords} records in ${batches} batches...`);

        for (let i = 0; i < batches; i++) {
            const records = [];
            const currentBatchSize = Math.min(batchSize, totalRecords - i * batchSize);

            for (let j = 0; j < currentBatchSize; j++) {
                records.push({
                    name: faker.person.fullName(),
                    hasConsented: faker.helpers.weightedArrayElement([
                        { value: 0, weight: 80 }, // 80% have not consented
                        { value: 1, weight: 20 }  // 20% have consented
                    ])
                });
            }

            // Insert all records in this batch
            const insertedRecords = await db.insert(parentRecord).values(records).returning();

            // Create child records for each parent (1-3 children per parent)
            const childRecords = [];
            for (const parent of insertedRecords) {
                const numChildren = faker.number.int({ min: 1, max: 3 });
                for (let k = 0; k < numChildren; k++) {
                    childRecords.push({
                        parentId: parent.id,
                        childName: faker.person.firstName(),
                        age: faker.number.int({ min: 1, max: 18 }),
                        isActive: faker.helpers.weightedArrayElement([
                            { value: 0, weight: 30 }, // 30% inactive
                            { value: 1, weight: 70 }  // 70% active
                        ])
                    });
                }
            }

            // Insert child records in batches
            if (childRecords.length > 0) {
                const childBatchSize = 500;
                for (let j = 0; j < childRecords.length; j += childBatchSize) {
                    const childBatch = childRecords.slice(j, j + childBatchSize);
                    await db.insert(childRecord).values(childBatch);
                }
            }

            if ((i + 1) % 10 === 0) {
                console.log(`Processed ${(i + 1) * batchSize} records...`);
            }
        }

        const finalCount = await db.select({ count: parentRecord.id }).from(parentRecord);
        const childCount = await db.select({ count: childRecord.id }).from(childRecord);
        console.log(`Seeding completed. Total parent records: ${finalCount.length}, Total child records: ${childCount.length}`);

        return c.json({
            message: "Database seeded successfully",
            recordsCreated: finalCount.length,
            childRecordsCreated: childCount.length,
            status: "completed" as const
        }, 200);

    } catch (error) {
        console.error("Error seeding database:", error);
        return c.json({
            error: "Failed to seed database",
            details: error instanceof Error ? error.message : "Unknown error"
        }, 500);
    }
});

export { loadData };
