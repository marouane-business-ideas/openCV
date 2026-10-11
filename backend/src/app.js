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

        // Initialize the Puppeteer cluster
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 20,
            retryLimit: 1,
            retryDelay: 1000,
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