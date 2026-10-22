/**
 * A user's active Stripe subscriptions. The checkout doesn't save the Stripe customer: subscriptions are found by the
 * user id they're given at checkout (see routers/stripe.js). Stripe's search can lag up to a minute behind changes.
 */
export const findActiveSubscriptions = async (stripe, userId) => {
    const { data } = await stripe.subscriptions.search({
        query: `status:'active' AND metadata['clerck_user_id']:'${userId.replaceAll("'", "\\'")}'`,
    });
    return data;
};
