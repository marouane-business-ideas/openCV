import express from "express";
import { getUserAccountType } from "../db.js";



const accountTypeRouter = (db) => {
    const router = express.Router();

    router.get("/:userId/account-type", async (req, res) => {
        const { userId } = req.params;

        try {
            const userAccountType = await getUserAccountType(db, userId);
            res.status(200).json({ userAccountType });
        } catch (error) {
            res.sendStatus(500);
        }

    });

    return router;
};

export default accountTypeRouter;