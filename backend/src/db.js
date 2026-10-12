import sqlite3 from "sqlite3";
import { open } from "sqlite";
import process from "process";

// Must match TemplateType in frontend/src/context/ResumeContext.ts
const RESUME_TEMPLATES = ["classic", "professional", "modern"];

const TEMPLATE_CHECK = `CHECK (template IN (${RESUME_TEMPLATES.map((template) => `'${template}'`).join(", ")}))`;

const createPdfMetadataTable = (tableName) => `
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            filename TEXT NOT NULL,
            jsonContent TEXT NOT NULL,
            htmlContent TEXT NOT NULL,
            template TEXT NOT NULL ${TEMPLATE_CHECK},
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `;

// SQLite can't alter a CHECK constraint: when a template is added, the table is rebuilt with the new constraint
async function migratePdfMetadataTemplates(db) {
    const { sql } = await db.get("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'pdf_metadata'");
    if (sql.includes(TEMPLATE_CHECK)) return;

    const columns = "id, userId, filename, jsonContent, htmlContent, template, createdAt";
    await db.exec("BEGIN");
    try {
        await db.exec(createPdfMetadataTable("pdf_metadata_new"));
        await db.exec(`INSERT INTO pdf_metadata_new (${columns}) SELECT ${columns} FROM pdf_metadata`);
        await db.exec("DROP TABLE pdf_metadata");
        await db.exec("ALTER TABLE pdf_metadata_new RENAME TO pdf_metadata");
        await db.exec("COMMIT");
        console.log(`pdf_metadata migrated to allow templates: ${RESUME_TEMPLATES.join(", ")}`);
    } catch (error) {
        await db.exec("ROLLBACK");
        throw error;
    }
}

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

    await db.exec(createPdfMetadataTable("pdf_metadata"));
    await migratePdfMetadataTemplates(db);

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