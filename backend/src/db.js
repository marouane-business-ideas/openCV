import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDb() {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    // Create the users table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            fullName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            accountType TEXT NOT NULL CHECK (accountType IN ('free', 'premium')),
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create the pdf_metadata table with a foreign key to users table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS pdf_metadata (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            filename TEXT NOT NULL,
            content TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Create an index on userId for faster lookups in pdf_metadata
    await db.exec(`
        CREATE INDEX IF NOT EXISTS idx_pdf_metadata_userId ON pdf_metadata(userId);
    `);

    return db;
}
