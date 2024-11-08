import dotenv from "dotenv";
import bodyParser from "body-parser";
import helmet from "helmet";
import process from "process";
import Stripe from "stripe";

import initApp from "./app.js";

import pdfRouter from "./routers/pdf.js";
import clerkAuthRouter from "./routers/clerkAuth.js";
import stripeRouter from "./routers/stripe.js";
import webhooksRouter from "./routers/webhooks.js";
import accountTypeRouter from "./routers/accountType.js";
import contactFormRouter from "./routers/contactForm.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripeWebhookSigningSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;


// Top level await to wait for the DB and Puppeteer to initialize first before moving forward
const { app, cluster, db } = await initApp();

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

// This middleware needs to be called before calling app.use(bodyParser.json());
app.use("/api/webhook", webhooksRouter(stripe, stripeWebhookSigningSecret, CLERK_WEBHOOK_SECRET, db));

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Required authentification and authorization for request on this route
app.use("/api/users", clerkAuthRouter);

// Stripe routes
app.use("/api/users", stripeRouter(stripe));

// Check account type (free or premium) route
app.use("/api/users", accountTypeRouter(db));

/**  PDF routes */
app.use("/api/users", pdfRouter(db, cluster));

// Contact form
app.use("/api/users", contactFormRouter(GMAIL_APP_PASSWORD));

// Cleanup browser on server shutdown
process.on("SIGTERM", async () => {
    if (cluster) {
        await cluster.idle();
        await cluster.close();
        console.log("Puppeteer Cluster closed gracefully on server shutdown.");
    }

    process.exit(0);
});