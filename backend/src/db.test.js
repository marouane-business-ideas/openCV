import { test } from "node:test";
import assert from "node:assert/strict";

import { addUser, checkCanDownloadPdf, ensureUser, incrementUserDownloadCount, initDb, markUserPremium, PDF_LIMIT_ERROR } from "./db.js";

const profile = (email, isPremium = false) => async () => ({ fullName: "Ada Lovelace", email, isPremium });

const accountType = async (db, userId) =>
    (await db.get("SELECT accountType FROM users WHERE id = ?", [userId]))?.accountType;

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

test("a paying user without a row is restored as premium, with no limit", async () => {
    const db = await initDb(":memory:");

    for (let i = 0; i < 6; i++) await downloadPdf(db, "user_1", profile("ada@example.com", true));

    assert.equal(await accountType(db, "user_1"), "premium");
});

test("a payment from a user without a row isn't lost", async () => {
    const db = await initDb(":memory:");

    // Stripe's search can lag behind a new subscription: the profile may still say free
    await markUserPremium(db, "user_1", "ada@example.com", profile("ada@example.com", false));

    assert.equal(await accountType(db, "user_1"), "premium");
});

test("a payment upgrades an existing free user", async () => {
    const db = await initDb(":memory:");
    await db.run("INSERT INTO users (id, fullName, email, accountType) VALUES ('user_1', 'Ada', 'ada@example.com', 'free')");

    await markUserPremium(db, "user_1", "ada@example.com", () => assert.fail("the profile shouldn't be fetched"));

    assert.equal(await accountType(db, "user_1"), "premium");
});

test("the sign-up webhook doesn't fail when the app already added the user's row", async () => {
    const db = await initDb(":memory:");
    await ensureUser(db, "user_1", profile("ada@example.com"));

    assert.equal(await addUser(db, { id: "user_1", fullName: "Ada Lovelace", email: "ada@example.com" }), false);
    assert.equal((await db.get("SELECT COUNT(*) AS count FROM users")).count, 1);
});

test("the app doesn't fetch the profile of a user the sign-up webhook already added", async () => {
    const db = await initDb(":memory:");

    assert.equal(await addUser(db, { id: "user_1", fullName: "Ada Lovelace", email: "ada@example.com" }), true);
    await ensureUser(db, "user_1", () => assert.fail("the profile shouldn't be fetched"));
});
