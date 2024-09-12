import express from "express";
import { Cluster } from "puppeteer-cluster";
import dotenv from "dotenv"
import bodyParser from "body-parser";
import React from "react";
import ReactDOMServer from "react-dom/server";
import helmet from "helmet";
import { Webhook } from "svix";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import process from "process";

import { getUserDownloadCount, incrementUserDownloadCount, initDb } from "./db.js";
import Preview from "./Preview.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = express();
const PORT = process.env.PORT || 1337;
const secret = process.env.CLERK_WEBHOOK_SECRET;

// Use Helmet for security headers
app.use(helmet());

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }
    next();
});


let db;
let cluster;

// Initialize the database and Puppeteer cluster at server start
initDb().then(async (database) => {
    db = database;
    console.log("Database initialized successfully");

    // Initialize the Puppeteer cluster
    cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 20,
        retryLimit: 1,
        retryDelay: 1000,
        puppeteerOptions: {
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-software-rasterizer",
                "--disable-extensions",
            ],
        },
    });

    console.log("Puppeteer Cluster initialized");

    // Start the server after the DB and cluster are ready
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to initialize the database or Puppeteer Cluster:", err);
    process.exit(1);
});


// This route needs to be called before calling app.use(bodyParser.json());
app.post("/api/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(secret);

    try {
        wh.verify(payload, headers);
    } catch (err) {
        console.error("Invalid signature:", err);
        return res.status(401).send("Invalid signature");
    }

    const { type, data } = JSON.parse(payload);
    console.log("*** Received webhook event:", type);

    if (type === "user.created") {
        const { id, first_name, last_name, email_addresses } = data;

        try {
            await db.run(`
                INSERT INTO users (id, fullName, email, accountType)
                VALUES (?, ?, ?, ?)`,
                [id, first_name + " " + last_name, email_addresses[0].email_address, "free"]
            );

            console.log("User registered in database:", first_name + " " + last_name);
            return res.status(201).send("User registered");
        } catch (err) {
            console.error("Error registering user:", err);
            return res.status(500).send("Internal Server Error");
        }
    } else if (type === "user.deleted") {
        const { id } = data;

        try {
            await db.run("DELETE FROM users WHERE id = ?", [id]);
            console.log("User deleted from database:", id);
            return res.status(200).send("User deleted");
        } catch (err) {
            console.error("Error deleting user:", err);
            return res.status(500).send("Internal Server Error");
        }
    } else {
        return res.status(400).send("Unhandled event type");
    }
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const authMw = (req, res, next) => {
    const authenticatedUserId = req.auth.userId;
    const { userId } = req.params;
    if (authenticatedUserId !== userId) {
        return res.status(403).send("Unauthorized!");
    }
    next();
}

app.use("/api/users/:userId/*", (req, res, next) => {
    next();
}, (req, res, next) => {
    ClerkExpressRequireAuth()(req, res, (err) => {
        if (err) {
            console.error("Authentication failed:", err);
            return res.status(401).json({ error: "Unauthenticated" });
        }
        next();
    });
}, authMw);


/**  PDF routes */
app.post("/api/users/:userId/pdfs", async (req, res) => {
    const { userId } = req.params;
    const { resume } = req.body;


    try {
        const userPdfCount = await getUserDownloadCount(db, userId);
        if (userPdfCount >= 5) throw new Error("SQLITE_CONSTRAINT: PDF limit exceeded for this user");

        const htmlContent = ReactDOMServer.renderToStaticMarkup(React.createElement(Preview, { resume: resume }));

        const pdfBuffer = await cluster.execute(async ({ page }) => {
            await page.setContent(htmlContent);
            const buffer = await page.pdf({ format: "A4", margin: { top: "35px" } });
            return buffer;
        });

        const filename = `CV_${Date.now()}.pdf`;

        // Insert metadata into SQLite database
        await db.run("INSERT INTO pdf_metadata (filename, content, userId) VALUES (?, ?, ?)", [filename, JSON.stringify(resume), userId]);

        await incrementUserDownloadCount(db, userId);
        console.log("PDF generated successfully");

        res.status(200).set({
            "Content-Type": "application/pdf",
            "Content-Length": pdfBuffer.length,
            "Content-Disposition": `attachment; filename="${filename}"`
        }).end(pdfBuffer);

    } catch (err) {
        console.error(err.message);
        if (err.message === "SQLITE_CONSTRAINT: PDF limit exceeded for this user") {
            return res.status(403).json({ status: "error", message: "You reached the limit of pdfs you can generate on the free plan" });
        }
        res.status(500).json({ status: "error", message: "An error occurred while generating the PDF" });
    }

});

app.get("/api/users/:userId/pdfs", async (req, res) => {
    const userId = req.params.userId;
    try {
        const rows = await db.all("SELECT content, datetime(createdAt, \"localtime\") as createdAt, id FROM pdf_metadata WHERE userId = ?", [userId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error retrieving PDFs:", err);
        res.status(500).json({ status: "error", message: "Failed to retrieve PDFs" });
    }
});

app.get("/api/users/:userId/pdfs/:pdfId", async (req, res) => {
    const { userId, pdfId } = req.params;
    try {
        const row = await db.get("SELECT * FROM pdf_metadata WHERE id = ? AND userId = ?", [pdfId, userId]);
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ status: "error", message: "PDF not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Failed to retrieve PDF" });
    }
});

app.put("/api/users/:userId/pdfs/:pdfId", async (req, res) => {
    const { userId, pdfId } = req.params;
    const { resume } = req.body;

    try {
        const userPdfCount = await getUserDownloadCount(db, userId);
        if (userPdfCount >= 5) throw new Error("SQLITE_CONSTRAINT: PDF limit exceeded for this user");

        const htmlContent = ReactDOMServer.renderToStaticMarkup(React.createElement(Preview, { resume: resume }));

        // Generate the PDF
        const pdfBuffer = await cluster.execute(async ({ page }) => {
            await page.setContent(htmlContent);
            const buffer = await page.pdf({ format: "A4", margin: { top: "35px" } });
            return buffer;
        });

        await db.run("UPDATE pdf_metadata SET content = ? WHERE id = ? AND userId = ?", [JSON.stringify(resume), pdfId, userId]);


        await incrementUserDownloadCount(db, userId);
        console.log("PDF generated successfully");

        res.status(200)
            .set({
                "Content-Type": "application/pdf",
                "Content-Length": pdfBuffer.length,
                "Content-Disposition": "attachment; filename=\"CV.pdf\""
            }).end(pdfBuffer);

    } catch (err) {
        console.error(err);
        if (err.message === "SQLITE_CONSTRAINT: PDF limit exceeded for this user") {
            return res.status(403).json({ status: "error", message: "You reached the limit of pdfs you can generate on the free plan" });
        }
        res.status(500).json({ status: "error", message: "Failed to generate PDF" });
    }
});

// Cleanup browser on server shutdown
process.on("SIGTERM", async () => {
    if (cluster) {
        await cluster.idle();
        await cluster.close();
        console.log("Puppeteer Cluster closed gracefully on server shutdown.");
    }

    process.exit(0);
});