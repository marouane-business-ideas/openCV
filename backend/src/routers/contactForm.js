import express from "express";
import { SMTPClient } from "emailjs";

const contactFormRouter = (mailClientPwd) => {

    const client = new SMTPClient({
        user: "faris.marouane@gmail.com",
        password: mailClientPwd,
        host: "smtp.gmail.com",
        tls: true,
    });

    const router = express.Router();

    router.post("/:userId/contact-form", async (req, res) => {
        const { userId } = req.params;
        const { name, formMessage } = req.body;

        try {
            const message = await client.sendAsync({
                from: "<faris.marouane@gmail.com>",
                to: "<support@onlineresume.dev>",
                subject: `Message from user: ${name}. userID: ${userId}`,
                text: formMessage,
            });
            console.log(message);
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    });

    return router;
};


export default contactFormRouter;