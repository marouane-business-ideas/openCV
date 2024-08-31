import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDb() {
    const db = await open({
        filename: './database.db',
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
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Create an index on userId for faster lookups in pdf_metadata
    await db.exec(`
        CREATE INDEX IF NOT EXISTS idx_pdf_metadata_userId ON pdf_metadata(userId);
    `);

    // Create a trigger to enforce PDF limit per user
    // await db.exec(`
    //     CREATE TRIGGER IF NOT EXISTS enforce_pdf_limit_insert
    //     BEFORE INSERT ON pdf_metadata
    //     BEGIN
    //         SELECT CASE
    //             WHEN (SELECT COUNT(*) FROM pdf_metadata WHERE userId = NEW.userId) >= 
    //                  (SELECT maxPdfs FROM users WHERE id = NEW.userId)
    //             THEN RAISE(ABORT, 'PDF limit exceeded for this user')
    //         END;
    //     END;
    // `);

    // await db.exec(`
    //     CREATE TRIGGER IF NOT EXISTS enforce_pdf_limit_update
    //     BEFORE UPDATE ON pdf_metadata
    //     BEGIN
    //         SELECT CASE
    //             WHEN (SELECT COUNT(*) FROM pdf_metadata WHERE userId = NEW.userId) >= 
    //                  (SELECT maxPdfs FROM users WHERE id = NEW.userId)
    //             THEN RAISE(ABORT, 'PDF limit exceeded for this user')
    //         END;
    //     END;
    // `);

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

// Add a function to get total downloads for a user
export async function getUserDownloadCount(db, userId) {
    const result = await db.get(`
        SELECT downloadedPdfs
        FROM users
        WHERE id = ?
    `, [userId]);
    return result ? result.downloadedPdfs : 0;
}
