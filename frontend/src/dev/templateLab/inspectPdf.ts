// The legacy build polyfills recent APIs (like Uint8Array.prototype.toHex) that Playwright's Chromium may not have yet
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;

// PDF units are points (1/72 in), CSS pixels are 1/96 in
const CSS_PX_PER_PT = 96 / 72;

export interface PdfText {
    text: string;
    // Position of the start of the baseline and width, in CSS pixels from the top left corner of the page
    x: number;
    y: number;
    width: number;
}

export interface PdfPage {
    // Exact size of the page, in CSS pixels
    width: number;
    height: number;
    // PNG data URL of the page, and its display size: the closest whole number of CSS pixels
    image: string;
    imageWidth: number;
    imageHeight: number;
    texts: PdfText[];
}

export const inspectPdf = async (pdfBytes: Uint8Array, pixelRatio: number): Promise<PdfPage[]> => {
    // pdf.js transfers the buffer to its worker: give it a copy
    const pdf = await getDocument({ data: pdfBytes.slice() }).promise;
    const pages: PdfPage[] = [];

    try {
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: CSS_PX_PER_PT });
            const renderViewport = page.getViewport({ scale: CSS_PX_PER_PT * pixelRatio });

            const imageWidth = Math.round(viewport.width);
            const imageHeight = Math.round(viewport.height);
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(imageWidth * pixelRatio);
            canvas.height = Math.round(imageHeight * pixelRatio);
            await page.render({ canvas, viewport: renderViewport }).promise;

            const { items } = await page.getTextContent();
            const texts = items
                .filter((item): item is TextItem => "str" in item)
                .map((item) => {
                    const [x, y] = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
                    return { text: item.str, x, y, width: item.width * CSS_PX_PER_PT };
                });

            pages.push({
                width: viewport.width,
                height: viewport.height,
                image: canvas.toDataURL("image/png"),
                imageWidth,
                imageHeight,
                texts,
            });
        }
    } finally {
        await pdf.destroy();
    }

    return pages;
};
