import express from "express";

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

const legacyRequireAuth = (req, res, next) => {
    if (!req.auth.userId) {
        console.error("Authentication failed");
        return res.status(401).json({ error: "Unauthenticated" });
    }
    next();
};

clerkAuthRouter.use("/:userId/*", legacyRequireAuth, authUsersRouteMw);

export default clerkAuthRouter;