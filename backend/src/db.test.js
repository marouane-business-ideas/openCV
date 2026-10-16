import { test } from "node:test";
import assert from "node:assert/strict";

import { checkCanDownloadPdf, incrementUserDownloadCount, initDb, PDF_LIMIT_ERROR } from "./db.js";

const profile = (email) => async () => ({ fullName: "Ada Lovelace", email });

const downloadPdf = async (db, userId, getUserProfile) => {
    await checkCanDownloadPdf(db, userId, getUserProfile);
    await incrementUserDownloadCount(db, userId);
};

test("a free user without a row is created from their profile and limited to 5 PDFs", async () => {
    const db = await initDb(":memory:");

    for (let i = 0; i < 5; i++) await downloadPdf(db, "user_1", profile("ada@example.com"));

    await assert.rejects(downloadPdf(db, "user_1", profile("ada@example.com")), { message: PDF_LIMIT_ERROR });
    const user = await db.get("SELECT fullName, email, accountType, downloadedPdfs FROM users WHERE id = ?", ["user_1"]);
    assert.deepEqual(user, { fullName: "Ada Lovelace", email: "ada@example.com", accountType: "free", downloadedPdfs: 5 });
});

test("an existing user's profile isn't fetched", async () => {
    const db = await initDb(":memory:");
    await db.run("INSERT INTO users (id, fullName, email, accountType) VALUES ('user_1', 'Ada', 'ada@example.com', 'free')");

    await checkCanDownloadPdf(db, "user_1", () => assert.fail("the profile shouldn't be fetched"));
});

test("premium users have no limit", async () => {
    const db = await initDb(":memory:");
    await db.run(`INSERT INTO users (id, fullName, email, accountType, downloadedPdfs)
        VALUES ('user_1', 'Ada', 'ada@example.com', 'premium', 50)`);

    await checkCanDownloadPdf(db, "user_1", profile("ada@example.com"));
});

test("a user whose row can't be created is refused, not given unlimited PDFs", async () => {
    const db = await initDb(":memory:");
    // Another account already uses this email: the row can't be inserted
    await db.run("INSERT INTO users (id, fullName, email, accountType) VALUES ('user_old', 'Ada', 'ada@example.com', 'free')");

    await assert.rejects(checkCanDownloadPdf(db, "user_new", profile("ada@example.com")), /can't be enforced/);
});

test("a user is refused when their profile can't be fetched", async () => {
    const db = await initDb(":memory:");

    await assert.rejects(checkCanDownloadPdf(db, "user_1", async () => { throw new Error("Clerk is down"); }),
        /Clerk is down/);
});
