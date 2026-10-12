import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { resumeInfoType } from "../../context/ResumeContext";
import { getResumeTemplate } from "./templates";
import { inlineFonts } from "./templateFonts";

/**
 * Builds the HTML the backend prints to PDF (see backend/src/pdf/renderPdf.js).
 * The template lab (template-lab.html) uses it too, to show and test the exact same output.
 */
export const buildResumeHtml = async (resume: resumeInfoType) => {
    const { Component, fonts } = getResumeTemplate(resume.resumeTemplate);
    const markup = renderToStaticMarkup(createElement(Component, { resume }));
    // Without a doctype, Chrome lays the page out in quirks mode, unlike the preview iframe
    return inlineFonts(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${markup}</body></html>`, fonts);
};
