import express from "express";
import process from "process";

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

    return router;
};


export default stripeRouter;