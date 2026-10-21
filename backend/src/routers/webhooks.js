import express from "express";
import { Webhook } from "svix";
import bodyParser from "body-parser";

import { addUser, formatFullName, markUserPremium } from "../db.js";

const webhooksRouter = (stripe, stripeWebhookSigningSecret, CLERK_WEBHOOK_SECRET, db, getUserProfile) => {
    const router = express.Router();

    router.post("/stripe", bodyParser.raw({ type: "application/json" }), async (req, res) => {
        let event;

        // Only events signed by Stripe are accepted: without the secret, none is
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                req.headers["stripe-signature"],
                stripeWebhookSigningSecret
            );
        } catch (err) {
            console.log("⚠️  Webhook signature verification failed.", err.message);
            return res.sendStatus(400);
        }

        if (event.type === "payment_intent.succeeded") {
            // Immediately return a 200 response to acknowledge receipt of the event, otherwise stripe is going to retry sending again and again ...
            res.status(200).send();

            try {
                const paymentIntent = event.data.object;

                const session = await stripe.checkout.sessions.list({ payment_intent: paymentIntent.id });
                const subscription = await stripe.subscriptions.retrieve(session.data[0].subscription);

                await markUserPremium(db, subscription.metadata.clerck_user_id, subscription.metadata.clerck_user_email,
                    getUserProfile);
            } catch (error) {
                console.error("Error handling stripe payment", error);
            }

        } else {
            console.log(`Unhandled event type ${event.type}.`);
            // Without a response, Stripe would count a failure, retry for days, and could disable the endpoint
            res.status(200).send();
        }
    });

    router.post("/clerk", bodyParser.raw({ type: "application/json" }), async (req, res) => {
        const payload = req.body;
        const headers = req.headers;

        const wh = new Webhook(CLERK_WEBHOOK_SECRET);

        try {
            wh.verify(payload, headers);
        } catch (err) {
            console.error("Invalid signature:", err);
            return res.sendStatus(401);
        }

        const { type, data } = JSON.parse(payload);
        console.log("*** Received webhook event:", type);

        if (type === "user.created") {
            const { id, first_name, last_name, email_addresses } = data;

            try {
                // The app may already have added the row (see ensureUser): a failure here would make Clerk retry
                // the webhook, then disable it
                const added = await addUser(db, {
                    id, fullName: formatFullName(first_name, last_name), email: email_addresses[0].email_address,
                });

                console.log(added ? "User registered in database:" : "User already in database:", id);
                return res.status(201).send("User registered");
            } catch (err) {
                console.error("Error registering user:", err);
                return res.sendStatus(500);
            }
        } else if (type === "user.deleted") {
            const { id } = data;

            try {
                await db.run("DELETE FROM users WHERE id = ?", [id]);
                console.log("User deleted from database:", id);
                return res.sendStatus(204);
            } catch (err) {
                console.error("Error deleting user:", err);
                return res.sendStatus(500);
            }
        } else {
            return res.status(400).send("Unhandled event type");
        }
    });

    return router;
};


export default webhooksRouter;