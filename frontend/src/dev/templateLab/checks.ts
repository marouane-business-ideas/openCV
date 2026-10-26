import { resumeInfoType } from "../../context/ResumeContext";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { withoutScheme } from "../../utils/schemify";
import { PdfPage } from "./inspectPdf";

// Templates keep at least this distance between their text and the left and right edges of the page
const SAFE_MARGIN = 24;

export interface PdfChecks {
    // Resume content that can't be found in the PDF (hidden, clipped or forgotten by the template)
    missingTexts: string[];
    // Text that overflows towards the edges of the page
    textsOutsideSafeArea: string[];
    // Pages without text, when the resume has some
    blankPages: number[];
}

const htmlTexts = (html: string) => {
    const body = new DOMParser().parseFromString(html, "text/html").body;
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const texts: string[] = [];
    while (walker.nextNode()) texts.push(walker.currentNode.textContent ?? "");
    return texts;
};

const expectedTexts = (resume: resumeInfoType) => {
    const { personalInfo, workExperience, education, skills, languages, links } = resume;
    return [
        personalInfo.name,
        personalInfo.title,
        personalInfo.email,
        formatPhoneNumber(personalInfo.phoneNumber),
        personalInfo.location,
        personalInfo.nationality,
        ...htmlTexts(personalInfo.summary),
        ...workExperience.flatMap((job) => [job.company, job.jobTitle, job.date, job.location, ...htmlTexts(job.description)]),
        ...education.flatMap((school) => [school.schoolName, school.degree, school.date, ...htmlTexts(school.description)]),
        ...skills,
        ...languages.map((language) => language.language),
        // Without a name, the templates show the URL
        ...links.map((link) => withoutScheme(link.linkName || link.linkUrl)),
    ].filter((text) => text.trim());
};

// Line breaks and text-transform change the text of the PDF but not its letters
const normalize = (text: string) => text.normalize("NFKC").replace(/\s+/g, "").toLowerCase();

export const checkPdf = (resume: resumeInfoType, pages: PdfPage[]): PdfChecks => {
    const pdfText = normalize(pages.flatMap((page) => page.texts.map(({ text }) => text)).join(""));
    const texts = expectedTexts(resume);

    return {
        missingTexts: texts.filter((text) => !pdfText.includes(normalize(text))),
        textsOutsideSafeArea: pages.flatMap((page) => page.texts
            .filter(({ text, x, width }) => text.trim() && (x < SAFE_MARGIN || x + width > page.width - SAFE_MARGIN))
            .map(({ text }) => text)),
        blankPages: texts.length === 0 ? [] : pages
            .map((page, index) => ({ pageNumber: index + 1, isBlank: page.texts.every(({ text }) => !text.trim()) }))
            .filter(({ isBlank }) => isBlank)
            .map(({ pageNumber }) => pageNumber),
    };
};
