import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const parentRecord = sqliteTable('parent_record', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    hasConsented: integer('has_consented', { mode: 'boolean' }).notNull(),
    name: text('name').notNull(),
});

export const childRecord = sqliteTable('child_record', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    parentId: integer('parent_id').references(() => parentRecord.id).notNull(),
    childName: text('child_name').notNull(),
    age: integer('age').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull(),
});

export type ParentRecord = typeof parentRecord.$inferSelect;
export type NewParentRecord = typeof parentRecord.$inferInsert;
export type ChildRecord = typeof childRecord.$inferSelect;
export type NewChildRecord = typeof childRecord.$inferInsert;
