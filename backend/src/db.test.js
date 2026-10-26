import { test } from "node:test";
import assert from "node:assert/strict";

import {
    addUser, checkCanDownloadPdf, deleteUser, ensureUser, formatFullName, incrementUserDownloadCount, initDb, markUserPremium, PDF_LIMIT_ERROR,
    updatePlanFromSubscription,
} from "./db.js";

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

test("when the app is free for everyone, a free user who used up their 5 PDFs can still download", async () => {
    const db = await initDb(":memory:");
    for (let i = 0; i < 5; i++) await downloadPdf(db, "user_1", profile("ada@example.com"));

    await checkCanDownloadPdf(db, "user_1", () => assert.fail("nothing should be checked"), { freeForEveryone: true });
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

const subscription = (status) => ({ status, metadata: { clerck_user_id: "user_1", clerck_user_email: "ada@example.com" } });

const premiumUser = async (downloadedPdfs = 0) => {
    const db = await initDb(":memory:");
    await db.run(`INSERT INTO users (id, fullName, email, accountType, downloadedPdfs)
        VALUES ('user_1', 'Ada', 'ada@example.com', 'premium', ?)`, [downloadedPdfs]);
    return db;
};

for (const status of ["canceled", "unpaid"]) {
    test(`a ${status} subscription puts the user back on the free plan`, async () => {
        const db = await premiumUser();

        assert.equal(await updatePlanFromSubscription(db, subscription(status), profile("ada@example.com")), "free");

        assert.equal(await accountType(db, "user_1"), "free");
    });
}

test("a former premium user gets the free plan's 5 PDFs, whatever they downloaded while premium", async () => {
    const db = await premiumUser(12);

    await updatePlanFromSubscription(db, subscription("canceled"), profile("ada@example.com"));

    for (let i = 0; i < 5; i++) await downloadPdf(db, "user_1", profile("ada@example.com"));
    await assert.rejects(downloadPdf(db, "user_1", profile("ada@example.com")), { message: PDF_LIMIT_ERROR });
});

test("the end of a subscription received twice doesn't give 5 more PDFs", async () => {
    const db = await premiumUser();
    await updatePlanFromSubscription(db, subscription("canceled"), profile("ada@example.com"));
    for (let i = 0; i < 5; i++) await downloadPdf(db, "user_1", profile("ada@example.com"));

    // Stripe sends customer.subscription.updated then .deleted for the same cancellation, and can resend events
    await updatePlanFromSubscription(db, subscription("canceled"), profile("ada@example.com"));

    await assert.rejects(downloadPdf(db, "user_1", profile("ada@example.com")), { message: PDF_LIMIT_ERROR });
});

test("premium is kept while Stripe retries a failed renewal", async () => {
    const db = await premiumUser();

    assert.equal(await updatePlanFromSubscription(db, subscription("past_due"), profile("ada@example.com")), null);

    assert.equal(await accountType(db, "user_1"), "premium");
});

test("a subscription paid again after being unpaid gives premium back", async () => {
    const db = await premiumUser();
    await updatePlanFromSubscription(db, subscription("unpaid"), profile("ada@example.com"));

    assert.equal(await updatePlanFromSubscription(db, subscription("active"), profile("ada@example.com")), "premium");

    assert.equal(await accountType(db, "user_1"), "premium");
});

test("the end of a subscription doesn't create a row for a user who has none", async () => {
    const db = await initDb(":memory:");

    await updatePlanFromSubscription(db, subscription("canceled"), () => assert.fail("the profile shouldn't be fetched"));

    assert.equal((await db.get("SELECT COUNT(*) AS count FROM users")).count, 0);
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

test("a deleted account's row and saved resumes are deleted, and no one else's", async () => {
    const db = await initDb(":memory:");
    const saveResume = (userId) => db.run(`INSERT INTO pdf_metadata (userId, filename, jsonContent, htmlContent, template)
        VALUES (?, 'CV.pdf', '{}', '<html></html>', 'classic')`, [userId]);
    await addUser(db, { id: "user_1", fullName: "Ada Lovelace", email: "ada@example.com" });
    await addUser(db, { id: "user_2", fullName: "Grace Hopper", email: "grace@example.com" });
    await saveResume("user_1");
    await saveResume("user_1");
    await saveResume("user_2");

    assert.equal(await deleteUser(db, "user_1"), 2);

    assert.deepEqual(await db.all("SELECT id FROM users"), [{ id: "user_2" }]);
    assert.deepEqual(await db.all("SELECT userId FROM pdf_metadata"), [{ userId: "user_2" }]);
});

test("a name the user didn't enter is left out of their full name", () => {
    assert.equal(formatFullName("Ada", "Lovelace"), "Ada Lovelace");
    assert.equal(formatFullName("Ada", null), "Ada");
    assert.equal(formatFullName(null, null), "");
});
