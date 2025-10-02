import { parentRecord, childRecord } from './schema';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

let db: any = null;

async function initializeDatabase() {
    const sqlite = new Database('data/exercise3.db');
    const drizzleDb = drizzle(sqlite);
    console.log('✅ Using SQLite database with Drizzle ORM');
    return drizzleDb;
}

export async function getDatabase() {
    if (!db) {
        db = await initializeDatabase();
    }
    return db;
}

export async function closeDatabase() {
    if (db) {
        db = null;
        console.log('Database connection closed');
    }
}

export { parentRecord, childRecord };
