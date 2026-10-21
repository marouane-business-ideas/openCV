import express from "express";
import process from "process";

import { findActiveSubscriptions } from "../subscriptions.js";

const stripeRouter = (stripe) => {
    const router = express.Router();

    router.post("/:userId/create-checkout-session", async (req, res) => {
        const { userId } = req.params;
        const { clerck_user_email } = req.body;

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