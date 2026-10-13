// @vitest-environment jsdom
import { assert, test, describe } from "vitest";

import { fromEditorHtml, toEditorHtml } from "../src/components/RichTextEditor/richText";

describe("toEditorHtml turns what the resume stores into what the editor works with", () => {
    test("each line of plain text becomes a paragraph, where < and > are text", () => {
        assert.strictEqual(toEditorHtml("First line\n\nA < B"), "<p>First line</p><p></p><p>A &lt; B</p>");
    });

    test("an empty field is an empty paragraph", () => {
        assert.strictEqual(toEditorHtml(""), "<p></p>");
    });

    test("HTML is kept, empty lines lose the <br> that gives them their height", () => {
        assert.strictEqual(toEditorHtml("<div>One</div><div><br></div><div><b>Two</b></div>"),
            "<div>One</div><div></div><div><b>Two</b></div>");
    });
});

describe("fromEditorHtml turns what the editor produces into what the resume stores", () => {
    test("paragraphs become lines, empty ones keep their height", () => {
        assert.strictEqual(fromEditorHtml("<p>One</p><p></p><p><strong>Two</strong></p>"),
            "<div>One</div><div><br></div><div><strong>Two</strong></div>");
    });

    test("list items hold their text directly", () => {
        assert.strictEqual(fromEditorHtml("<ul><li><p>One</p></li><li><p>Two</p></li></ul>"), "<ul><li>One</li><li>Two</li></ul>");
    });

    test("empty lines at the end are dropped, an empty editor is an empty field", () => {
        assert.strictEqual(fromEditorHtml("<p>One</p><p></p><p></p>"), "<div>One</div>");
        assert.strictEqual(fromEditorHtml("<p></p>"), "");
    });

    test("text that looks like HTML stays text", () => {
        assert.strictEqual(fromEditorHtml("<p>&lt;b&gt;tags&lt;/b&gt;</p>"), "<div>&lt;b&gt;tags&lt;/b&gt;</div>");
    });
});
