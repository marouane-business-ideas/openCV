import express from "express";
import process from "process";

import { findActiveSubscriptions } from "../subscriptions.js";

// Stripe's pages in the app's language, sent by its forms: by default Stripe uses the browser's, which may differ
const stripeLocale = (language) => (["en", "fr"].includes(language) ? language : "auto");

const stripeRouter = (stripe) => {
    const router = express.Router();

    router.post("/:userId/create-checkout-session", async (req, res) => {
        const { userId } = req.params;
        const { clerck_user_email, language } = req.body;

        try {
            const session = await stripe.checkout.sessions.create({
                customer_email: clerck_user_email,
                line_items: [
                    {
                        price: process.env.ANNUAL_PREMIUM_PLAN_STRIPE_PRICE_ID,
                        quantity: 1,
                    },
                ],
                mode: "subscription",
                success_url: process.env.STRIPE_SUCCESS_URL,
                cancel_url: process.env.STRIPE_CANCEL_URL,
                automatic_tax: { enabled: true },
                currency: "eur",
                locale: stripeLocale(language),
                subscription_data: {
                    metadata: {
                        clerck_user_id: userId,
                        clerck_user_email
                    }
                }
            });

            res.redirect(303, session.url);
        } catch (error) {
            console.error("Checkout session error", error);
            res.sendStatus(500);
        }
    });

    // Stripe's customer portal, where premium users cancel their subscription, change their card and download their
    // invoices. What it allows is set in the Stripe dashboard: Settings > Billing > Customer portal
    router.post("/:userId/manage-subscription", async (req, res) => {
        const { userId } = req.params;

        try {
            const [subscription] = await findActiveSubscriptions(stripe, userId);
            if (!subscription) return res.status(404).send("No active subscription");

            const session = await stripe.billingPortal.sessions.create({
                customer: subscription.customer,
                return_url: process.env.STRIPE_PORTAL_RETURN_URL,
                locale: stripeLocale(req.body.language),
            });

            res.redirect(303, session.url);
        } catch (error) {
            console.error("Customer portal session error", error);
            res.sendStatus(500);
        }
    });

    return router;
};


export default stripeRouter;