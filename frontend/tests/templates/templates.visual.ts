import { expect, test } from "@playwright/test";
import type { TemplateLabResult } from "../../src/dev/templateLab/TemplateLab";

// Every resume is printed with every template, so that the templates are compared on the same text.
// Each case is printed by the template lab (template-lab.html), which goes through the same code as the
// download button: buildResumeHtml() in the browser, then renderPdf() of the backend
const templates = ["classic", "professional", "modern"];
// See src/dev/templateLab/fixtures.ts
const fixtures = ["sample", "reference", "long", "empty"];
// French only changes the headings: the sample resume is enough
const languages: Record<string, string[]> = { sample: ["en", "fr"] };

// Number of pages of each case: a change means content moved to another page
const pageCounts: Record<string, number> = {
    "classic-sample-en": 1, "classic-sample-fr": 1, "classic-reference-en": 2, "classic-long-en": 3, "classic-empty-en": 1,
    "professional-sample-en": 2, "professional-sample-fr": 2, "professional-reference-en": 2, "professional-long-en": 3,
    "professional-empty-en": 1,
    "modern-sample-en": 2, "modern-sample-fr": 2, "modern-reference-en": 1, "modern-long-en": 3, "modern-empty-en": 1,
};

const cases = templates.flatMap((template) => fixtures.flatMap((fixture) =>
    (languages[fixture] ?? ["en"]).map((lang) => ({ template, fixture, lang, name: `${template}-${fixture}-${lang}` }))));

for (const { template, fixture, lang, name } of cases) {
    test(name, async ({ page }, testInfo) => {
        await page.goto(`/template-lab.html?template=${template}&fixture=${fixture}&lang=${lang}`);
        const result: TemplateLabResult = await (await page.waitForFunction(() => window.templateLabResult)).jsonValue();

        await testInfo.attach(`${name}.pdf`, { body: Buffer.from(result.pdfBase64, "base64"), contentType: "application/pdf" });

        expect(result.missingTexts, "resume content missing from the PDF").toEqual([]);
        expect(result.textsOutsideSafeArea, "text too close to the edges of the page").toEqual([]);
        expect(result.blankPages, "blank pages").toEqual([]);
        expect(result.pageCount, "number of pages").toBe(pageCounts[name]);

        for (let pageNumber = 1; pageNumber <= result.pageCount; pageNumber++) {
            await expect(page.locator(`img[data-page="${pageNumber}"]`)).toHaveScreenshot(`${name}-page-${pageNumber}.png`);
        }
    });
}
