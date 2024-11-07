import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const clerkAuthRouter = express.Router();

const authUsersRouteMw = (req, res, next) => {
    const authenticatedUserId = req.auth.userId;
    const { userId } = req.params;
    if (authenticatedUserId !== userId) {
        console.log("Unauthorized", authenticatedUserId, userId);
        return res.status(403).send("Unauthorized!");
    }
    next();
};

clerkAuthRouter.use("/:userId/*", (req, res, next) => {
    ClerkExpressRequireAuth()(req, res, (err) => {
        if (err) {
            console.error("Authentication failed:", err);
            return res.status(401).json({ error: "Unauthenticated" });
        }
        next();
    });
}, authUsersRouteMw);

export default clerkAuthRouter;