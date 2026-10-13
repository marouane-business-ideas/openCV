// Conversions between what the resume stores and what the editor works with.
//
// The resume stores one <div> per line, and <div><br></div> for an empty line, like the editor used before:
// the templates print that format as is. The editor works with paragraphs (<p>).

const parse = (html: string) => new DOMParser().parseFromString(html, "text/html").body;

const escapeText = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const hasTags = (value: string) => /<\/?[a-z][^>]*>/i.test(value);

const isEmptyLine = (element: Element) =>
    !element.textContent?.trim() && [...element.children].every((child) => child.tagName === "BR");

/**
 * What the resume stores, for the editor. A value without any tag is text typed in a plain field: each line becomes a
 * paragraph. Anything else is HTML: the editor keeps what its buttons can produce and drops the rest.
 */
export const toEditorHtml = (value: string) => {
    if (!hasTags(value)) {
        return value.split(/\r?\n/).map((line) => `<p>${escapeText(line)}</p>`).join("");
    }
    const body = parse(value);
    // An empty line holds a <br> so that it keeps its height when printed. In the editor, that <br> would be a line
    // break inside the line: the line would become two
    body.querySelectorAll("div, p").forEach((line) => {
        if (isEmptyLine(line)) line.replaceChildren();
    });
    return body.innerHTML;
};

/** What the editor produces, for the resume */
export const fromEditorHtml = (html: string) => {
    const body = parse(html);
    body.querySelectorAll("p").forEach((paragraph) => {
        // The text of a list item is a paragraph in the editor
        if (paragraph.parentElement?.tagName === "LI" && paragraph === paragraph.parentElement.firstElementChild) {
            paragraph.replaceWith(...paragraph.childNodes);
            return;
        }
        const line = document.createElement("div");
        line.append(...(isEmptyLine(paragraph) ? [document.createElement("br")] : paragraph.childNodes));
        paragraph.replaceWith(line);
    });
    // Empty lines at the end would only add space under the text
    while (body.lastElementChild && body.lastElementChild.tagName === "DIV" && isEmptyLine(body.lastElementChild)) {
        body.lastElementChild.remove();
    }
    return body.innerHTML;
};
