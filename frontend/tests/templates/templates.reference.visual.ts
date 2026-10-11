import { expect, test } from "@playwright/test";
import type { TemplateLabResult } from "../../src/dev/templateLab/TemplateLab";
import type { Area, PageLayout, Rule, TextLine } from "../../src/dev/templateLab/measurePage";

interface Tolerance {
    // Vertical position of the text lines and rules
    baseline: number;
    // Where text lines start and end, where rules start and end
    edges: number;
}

/**
 * Templates built from a design picture: the first page of their PDF must keep the layout of the picture.
 * Pictures are cropped to the edges of the page (any resolution). Red is ignored, for annotations.
 */
const references = [
    {
        template: "modern",
        fixture: "reference",
        picture: "references/modern.png",
        // Measured separately so that the lines of the two columns don't merge
        areas: { header: [40, 20, 770, 330], main: [40, 330, 455, 1059], side: [470, 330, 770, 1059] } as Record<string, Area>,
        // The picture is only 602px wide for the page: each of its pixels is 1.3px here, and the edges of light text are blurred
        tolerance: { baseline: 4, edges: 5 },
        // In the picture, the first job is 6px further from its rule than every other first line: the template keeps one gap
        areaTolerance: { main: { baseline: 8, edges: 5 } } as Record<string, Tolerance>,
        // Lines (numbered from 1) that can't end like in the picture, because of the data rather than the template:
        // the picture breaks the address after "1108 Lenview Dr", the form has a single location field
        lineEndsToIgnore: { side: [5, 6] } as Record<string, number[]>,
    },
];

const describeLine = ({ baseline, left, right }: TextLine) => `baseline ${baseline}, x ${left}-${right}`;

const compare = (
    picture: PageLayout,
    pdf: PageLayout,
    tolerance: Tolerance,
    areaTolerance: Record<string, Tolerance>,
    lineEndsToIgnore: Record<string, number[]>,
) => {
    const report: string[] = [];
    const problems: string[] = [];
    const check = (label: string, delta: number, max: number) => {
        if (Math.abs(delta) > max) problems.push(`${label}: ${delta > 0 ? "+" : ""}${delta}px (tolerance ${max}px)`);
    };

    report.push(`RULES (${picture.rules.length} in the picture, ${pdf.rules.length} in the PDF)`);
    if (picture.rules.length !== pdf.rules.length) problems.push(`${pdf.rules.length} rules instead of ${picture.rules.length}`);
    picture.rules.forEach((expected: Rule, index) => {
        const actual = pdf.rules[index];
        if (!actual) return;
        report.push(`  y ${expected.y} x ${expected.left}-${expected.right}  |  y ${actual.y} x ${actual.left}-${actual.right}`);
        check(`rule ${index + 1}, vertical position`, actual.y - expected.y, tolerance.baseline);
        check(`rule ${index + 1}, start`, actual.left - expected.left, tolerance.edges);
        check(`rule ${index + 1}, end`, actual.right - expected.right, tolerance.edges);
    });

    for (const [area, expectedLines] of Object.entries(picture.lines)) {
        const actualLines = pdf.lines[area];
        const { baseline, edges } = areaTolerance[area] ?? tolerance;
        report.push(`${area.toUpperCase()} (${expectedLines.length} lines in the picture, ${actualLines.length} in the PDF)`);
        // Different line counts mean different line breaks: comparing the lines one by one would make no sense
        if (expectedLines.length !== actualLines.length) {
            problems.push(`${area}: ${actualLines.length} lines instead of ${expectedLines.length}`);
        }
        expectedLines.forEach((expected, index) => {
            const actual = actualLines[index];
            report.push(`  ${describeLine(expected).padEnd(30)}|  ${actual ? describeLine(actual) : "-"}`);
            if (!actual || expectedLines.length !== actualLines.length) return;
            check(`${area}, line ${index + 1}, baseline`, actual.baseline - expected.baseline, baseline);
            check(`${area}, line ${index + 1}, start`, actual.left - expected.left, edges);
            // A line that ends elsewhere doesn't hold the same words
            if (!lineEndsToIgnore[area]?.includes(index + 1)) {
                check(`${area}, line ${index + 1}, end`, actual.right - expected.right, edges);
            }
        });
    }
    return { problems, report: report.join("\n") };
};

for (const { template, fixture, picture, areas, tolerance, areaTolerance, lineEndsToIgnore } of references) {
    test(`${template} template looks like ${picture}`, async ({ page }, testInfo) => {
        await page.goto(`/template-lab.html?template=${template}&fixture=${fixture}&lang=en`);
        const result: TemplateLabResult = await (await page.waitForFunction(() => window.templateLabResult)).jsonValue();
        expect(result.pageCount, "the picture shows a single page").toBe(1);

        const pictureUrl = `/tests/templates/${picture}`;
        const { pictureLayout, pdfLayout, overlay } = await page.evaluate(async ({ pictureUrl, areas }) => {
            const { measurePage, overlayImages } = window.templateLabTools;
            const pdfPage = (document.querySelector("img[data-page='1']") as HTMLImageElement).src;
            return {
                pictureLayout: await measurePage(pictureUrl, areas),
                pdfLayout: await measurePage(pdfPage, areas),
                overlay: await overlayImages(pdfPage, pictureUrl),
            };
        }, { pictureUrl, areas });

        const { problems, report } = compare(pictureLayout, pdfLayout, tolerance, areaTolerance, lineEndsToIgnore);
        await testInfo.attach("picture (red) over the PDF.png", { body: Buffer.from(overlay.split(",")[1], "base64"), contentType: "image/png" });
        await testInfo.attach("measures (picture | PDF).txt", { body: report, contentType: "text/plain" });

        expect(problems, `differences with the picture beyond the tolerance\n${report}`).toEqual([]);
    });
}
