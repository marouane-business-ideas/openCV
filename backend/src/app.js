import express from "express";
import process from "process";
import { Cluster } from "puppeteer-cluster";

import { initDb } from "./db.js";
import { PUPPETEER_LAUNCH_OPTIONS } from "./pdf/renderPdf.js";

const PORT = process.env.PORT || 1337;

// Initialize the database and Puppeteer cluster at server start
const initApp = async () => {
    const app = express();
    try {
        const db = await initDb();
        console.log("Database initialized successfully");

        // Printing a PDF keeps a CPU busy: measured on the VPS (2 vCPUs), 10 at a time print as many PDFs per minute as
        // 20 (about 550), with half the extra memory and pages opening twice as fast. Opening a page must stay well
        // under the 5 s puppeteer-cluster allows: past that it restarts Chrome, failing the PDFs in progress, and can
        // crash the server. The other requests wait in the cluster's queue
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 10,
            puppeteerOptions: PUPPETEER_LAUNCH_OPTIONS,
        });

        console.log("Puppeteer Cluster initialized");

        // Start the server after the DB and cluster are ready
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is listening on port ${PORT}`);
        });

        return { app, db, cluster };

    } catch (error) {
        console.error("Failed to initialize the database or Puppeteer Cluster:", error);
        process.exit(1);
    }
};


export default initApp;