import sqlite3 from "sqlite3";
import { open } from "sqlite";
import process from "process";


export async function initDb() {
    const db = await open({
        filename: process.cwd() + "/database/database.db",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            fullName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            accountType TEXT NOT NULL CHECK (accountType IN ('free', 'premium')),
            maxPdfs INTEGER NOT NULL DEFAULT 5,
            downloadedPdfs INTEGER NOT NULL DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS pdf_metadata (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            filename TEXT NOT NULL,
            content TEXT NOT NULL,
            template TEXT NOT NULL CHECK (template IN ('classic', 'professional')),
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

export async function incrementUserDownloadCount(db, userId) {
    await db.run(`
        UPDATE users
        SET downloadedPdfs = downloadedPdfs + 1
        WHERE id = ?
    `, [userId]);

    const userPdfCount = await getUserDownloadCount(db, userId);

    return userPdfCount;
}

export async function getUserDownloadCount(db, userId) {
    const result = await db.get(`
        SELECT downloadedPdfs
        FROM users
        WHERE id = ?
    `, [userId]);
    return result ? result.downloadedPdfs : 0;
}


export async function getUserMaxPdfs(db, userId) {
    const result = await db.get(`
        SELECT maxPdfs
        FROM users
        WHERE id = ?
    `, [userId]);
    return result ? result.maxPdfs : 5;
}

export async function getUserAccountType(db, userId) {
    const result = await db.get(`
        SELECT accountType
        FROM users
        WHERE id = ?
    `, [userId]);

    return result ? result.accountType : "free";
}