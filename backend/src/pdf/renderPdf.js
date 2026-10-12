import puppeteer from "puppeteer";

export const PUPPETEER_LAUNCH_OPTIONS = {
    headless: true,
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-extensions",
    ],
};

// The preview iframe mimics the top margin: see #pdf-viewer-iframe in frontend/src/index.css
const PDF_OPTIONS = { format: "A4", margin: { top: "35px", bottom: "30px" } };

/**
 * Turns the HTML of a resume into the PDF users download.
 * The frontend's template lab and template tests go through this function too,
 * so what they show is exactly what users get.
 */
export const renderPdf = async (page, html) => {
    await page.setContent(html);
    return page.pdf(PDF_OPTIONS);
};

/**
 * Standalone renderer for dev tooling (the server uses its Puppeteer cluster instead).
 */
export const launchPdfRenderer = async () => {
    const browser = await puppeteer.launch(PUPPETEER_LAUNCH_OPTIONS);

    return {
        render: async (html) => {
            const page = await browser.newPage();
            try {
                return await renderPdf(page, html);
            } finally {
                await page.close();
            }
        },
        close: () => browser.close(),
    };
};
