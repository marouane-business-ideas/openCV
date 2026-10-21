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

export async function initDb(filename = process.cwd() + "/database/database.db") {
    const db = await open({
        filename,
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

export const PDF_LIMIT_ERROR = "SQLITE_CONSTRAINT: PDF limit exceeded for this user";

/** The name saved in a user's row: Clerk gives null for a first or last name the user didn't enter */
export const formatFullName = (firstName, lastName) => [firstName, lastName].filter(Boolean).join(" ");

/**
 * Adds a user's row unless they already have one, and tells whether it did. Clerk's user.created webhook and
 * ensureUser() can both add a new user's row, in either order: the second one must not fail.
 */
export async function addUser(db, { id, fullName, email, accountType = "free" }) {
    const { changes } = await db.run("INSERT OR IGNORE INTO users (id, fullName, email, accountType) VALUES (?, ?, ?, ?)",
        [id, fullName, email, accountType]);
    return changes > 0;
}

/**
 * Users normally get their row from Clerk's user.created webhook, at sign-up. When it's missing (the webhook failed,
 * or the database was started over), it's created here from the user's Clerk profile and Stripe subscription:
 * without a row, the download count can't be saved, the free plan's limit would never apply, and paying users would
 * be treated as free.
 */
export async function ensureUser(db, userId, getUserProfile) {
    if (await db.get("SELECT 1 FROM users WHERE id = ?", [userId])) return;

    const { fullName, email, isPremium } = await getUserProfile(userId);
    await addUser(db, { id: userId, fullName, email, accountType: isPremium ? "premium" : "free" });
}

/** On a successful payment: the row is created first if missing, so the payment can't go unrecorded */
export async function markUserPremium(db, userId, email, getUserProfile) {
    await ensureUser(db, userId, getUserProfile);
    await db.run("UPDATE users SET accountType = 'premium' WHERE id = ? OR email = ?", [userId, email]);
}

// canceled: by the user, by us, or by Stripe once a renewal's payment retries are exhausted. unpaid: the same, with
// Stripe's "mark as unpaid" setting. The others can't happen with our checkout, but don't give premium either
const ENDED_SUBSCRIPTION_STATUSES = ["canceled", "unpaid", "incomplete_expired", "paused"];

/**
 * Keeps a user's plan in line with their Stripe subscription when it changes, and returns the plan it set, if any.
 * past_due (Stripe is retrying a failed renewal) and incomplete (the first payment is in progress, see markUserPremium)
 * leave the plan as it is.
 */
export async function updatePlanFromSubscription(db, { status, metadata }, getUserProfile) {
    const { clerck_user_id: userId, clerck_user_email: email } = metadata;

    if (status === "active") {
        await markUserPremium(db, userId, email, getUserProfile);
        return "premium";
    }
    if (ENDED_SUBSCRIPTION_STATUSES.includes(status)) {
        await db.run("UPDATE users SET accountType = 'free' WHERE id = ? OR email = ?", [userId, email]);
        return "free";
    }
    return null;
}

/** Throws PDF_LIMIT_ERROR when a free user has used up their PDFs, and refuses users the limit can't be checked for */
export async function checkCanDownloadPdf(db, userId, getUserProfile) {
    await ensureUser(db, userId, getUserProfile);

    const user = await db.get("SELECT accountType, downloadedPdfs, maxPdfs FROM users WHERE id = ?", [userId]);
    // E.g. another row already has this email: without a row of their own, the download couldn't be counted
    if (!user) throw new Error(`No user row for ${userId}: the PDF limit can't be enforced`);

    if (user.accountType === "free" && user.downloadedPdfs >= user.maxPdfs) throw new Error(PDF_LIMIT_ERROR);
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


export async function getUserAccountType(db, userId) {
    const result = await db.get(`
        SELECT accountType
        FROM users
        WHERE id = ?
    `, [userId]);

    return result ? result.accountType : "free";
}