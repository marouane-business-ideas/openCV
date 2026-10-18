import express from "express";
import { ensureUser, getUserAccountType } from "../db.js";



const accountTypeRouter = (db, getUserProfile) => {
    const router = express.Router();

    router.get("/:userId/account-type", async (req, res) => {
        const { userId } = req.params;

        try {
            // A paying user without a row would otherwise be shown the free plan
            await ensureUser(db, userId, getUserProfile);
            const userAccountType = await getUserAccountType(db, userId);
            res.status(200).json({ userAccountType });
        } catch (error) {
            res.sendStatus(500);
        }

    });

    return router;
};

export default accountTypeRouter;