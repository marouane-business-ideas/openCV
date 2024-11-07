import express from "express";

import { getUserAccountType, getUserDownloadCount, getUserMaxPdfs, incrementUserDownloadCount } from "../db.js";

const pdfRouter = (db, cluster) => {
    const router = express.Router();

    router.route("/:userId/pdfs")
        .post(async (req, res) => {
            const { userId } = req.params;
            const { resumeHtml, resumeData, template } = req.body;

            try {
                const [userAccountType, userPdfCount, userMaxPdfs] = await Promise.all([
                    await getUserAccountType(db, userId),
                    await getUserDownloadCount(db, userId),
                    await getUserMaxPdfs(db, userId)
                ]);

                if (userAccountType === "free") {
                    if (userPdfCount >= userMaxPdfs) throw new Error("SQLITE_CONSTRAINT: PDF limit exceeded for this user");
                }

                const pdfBuffer = await cluster.execute(async ({ page }) => {
                    await page.setContent(resumeHtml);
                    const buffer = await page.pdf({ format: "A4", margin: { top: "35px", bottom: "30px" } });
                    return buffer;
                });

                const filename = `CV_${Date.now()}.pdf`;

                // Insert metadata into SQLite database
                await db.run("INSERT INTO pdf_metadata (filename, jsonContent, htmlContent, userId, template) VALUES (?, ?, ?, ?, ?)",
                    [filename, JSON.stringify(resumeData), resumeHtml, userId, template]
                );

                await incrementUserDownloadCount(db, userId);
                console.log("PDF generated successfully");

                res.status(200).set({
                    "Content-Type": "application/pdf",
                    "Content-Length": pdfBuffer.length,
                    "Content-Disposition": `attachment; filename="${filename}"`
                }).end(pdfBuffer);

            } catch (err) {
                console.error(err.message);
                if (err.message === "SQLITE_CONSTRAINT: PDF limit exceeded for this user") {
                    return res.status(403).json({ status: "Forbidden", message: "You reached the limit of pdfs you can generate on the free plan" });
                }
                res.status(500).json({ status: "Internal Server Error", message: "An error occurred while generating the PDF" });
            }

        })
        .get(async (req, res) => {
            const userId = req.params.userId;
            try {
                // eslint-disable-next-line max-len
                const rows = await db.all("SELECT jsonContent, datetime(createdAt, \"localtime\") as createdAt, id, template FROM pdf_metadata WHERE userId = ?", [userId]);
                res.status(200).json(rows);
            } catch (err) {
                console.error("Error retrieving PDFs:", err);
                res.status(500).json({ status: "Internal Server Error", message: "Failed to retrieve PDFs" });
            }
        });

    router.route("/:userId/pdfs/:pdfId")
        .get(async (req, res) => {
            const { userId, pdfId } = req.params;
            try {
                const row = await db.get("SELECT * FROM pdf_metadata WHERE id = ? AND userId = ?", [pdfId, userId]);
                if (row) {
                    res.status(200).json(row);
                } else {
                    res.status(404).json({ status: "Not Found ", message: "PDF not found" });
                }
            } catch (err) {
                console.error(err);
                res.status(500).json({ status: "Internal Server Error", message: "Failed to retrieve PDF" });
            }
        })
        .put(async (req, res) => {
            const { userId, pdfId } = req.params;
            const { resumeHtml, resumeData, template } = req.body;

            try {
                const [userAccountType, userPdfCount, userMaxPdfs] = await Promise.all([
                    await getUserAccountType(db, userId),
                    await getUserDownloadCount(db, userId),
                    await getUserMaxPdfs(db, userId)
                ]);

                if (userAccountType === "free") {
                    if (userPdfCount >= userMaxPdfs) throw new Error("SQLITE_CONSTRAINT: PDF limit exceeded for this user");
                }


                // Generate the PDF
                const pdfBuffer = await cluster.execute(async ({ page }) => {
                    await page.setContent(resumeHtml);
                    const buffer = await page.pdf({ format: "A4", margin: { top: "35px", bottom: "30px" } });
                    return buffer;
                });

                await db.run("UPDATE pdf_metadata SET jsonContent = ?, htmlContent = ?, template = ? WHERE id = ? AND userId = ?",
                    [JSON.stringify(resumeData), resumeHtml, template, pdfId, userId]
                );

                await incrementUserDownloadCount(db, userId);
                console.log("PDF generated successfully");

                res.status(200)
                    .set({
                        "Content-Type": "application/pdf",
                        "Content-Length": pdfBuffer.length,
                        "Content-Disposition": "attachment; filename=\"CV.pdf\""
                    }).end(pdfBuffer);

            } catch (err) {
                console.error(err);
                if (err.message === "SQLITE_CONSTRAINT: PDF limit exceeded for this user") {
                    return res.status(403).json({ status: "Forbidden", message: "You reached the limit of pdfs you can generate on the free plan" });
                }
                res.status(500).json({ status: "Internal Server Error", message: "Failed to generate PDF" });
            }
        });

    return router;
};


export default pdfRouter;