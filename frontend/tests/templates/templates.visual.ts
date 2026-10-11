import { expect, test } from "@playwright/test";
import type { TemplateLabResult } from "../../src/dev/templateLab/TemplateLab";

// Each case is printed by the template lab (template-lab.html), which goes through the same code as the
// download button: buildResumeHtml() in the browser, then renderPdf() of the backend
const cases = [
    { template: "classic", fixture: "sample", lang: "en", pages: 1 },
    { template: "classic", fixture: "sample", lang: "fr", pages: 1 },
    { template: "classic", fixture: "long", lang: "en", pages: 3 },
    { template: "classic", fixture: "empty", lang: "en", pages: 1 },
    { template: "professional", fixture: "sample", lang: "en", pages: 2 },
    { template: "professional", fixture: "sample", lang: "fr", pages: 2 },
    { template: "professional", fixture: "long", lang: "en", pages: 3 },
    { template: "professional", fixture: "empty", lang: "en", pages: 1 },
    { template: "modern", fixture: "reference", lang: "en", pages: 1 },
    { template: "modern", fixture: "sample", lang: "en", pages: 2 },
    { template: "modern", fixture: "sample", lang: "fr", pages: 2 },
    { template: "modern", fixture: "long", lang: "en", pages: 3 },
    { template: "modern", fixture: "empty", lang: "en", pages: 1 },
];

for (const { template, fixture, lang, pages } of cases) {
    const name = `${template}-${fixture}-${lang}`;

    test(name, async ({ page }, testInfo) => {
        await page.goto(`/template-lab.html?template=${template}&fixture=${fixture}&lang=${lang}`);
        const result: TemplateLabResult = await (await page.waitForFunction(() => window.templateLabResult)).jsonValue();

        await testInfo.attach(`${name}.pdf`, { body: Buffer.from(result.pdfBase64, "base64"), contentType: "application/pdf" });

        expect(result.missingTexts, "resume content missing from the PDF").toEqual([]);
        expect(result.textsOutsideSafeArea, "text too close to the edges of the page").toEqual([]);
        expect(result.blankPages, "blank pages").toEqual([]);
        expect(result.pageCount, "number of pages").toBe(pages);

        for (let pageNumber = 1; pageNumber <= result.pageCount; pageNumber++) {
            await expect(page.locator(`img[data-page="${pageNumber}"]`)).toHaveScreenshot(`${name}-page-${pageNumber}.png`);
        }
    });
}
