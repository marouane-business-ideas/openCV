import { assert, test, describe } from "vitest";

import schemify, { withoutScheme } from "../src/utils/schemify";


describe("Schemify adds appropriate protocol scheme info before url", () => {
    test("google.com => https://google.com", () => {
        assert.strictEqual(schemify("google.com"), "https://google.com");
    });

    test("www.google.com => https://www.google.com", () => {
        assert.strictEqual(schemify("www.google.com"), "https://www.google.com");
    });

    test("google.com => https://google.com with https scheme", () => {
        assert.strictEqual(schemify("google.com", "https"), "https://google.com");
    });

    test("www.google.com => https://www.google.com with https scheme", () => {
        assert.strictEqual(schemify("www.google.com", "https"), "https://www.google.com");
    });

    test("example.com to ftp://example.com with \"ftp\" scheme", () => {
        assert.strictEqual(schemify("example.com", "ftp"), "ftp://example.com");
    });

    test("www.google.com to XXX://www.google.com with \"XXX\" scheme", () => {
        assert.strictEqual(schemify("www.google.com", "XXX"), "XXX://www.google.com");
    });
});

describe("Schemify doesn't modify URLs that already have a protocol scheme", () => {
    test("http://google.com => http://google.com", () => {
        assert.strictEqual(schemify("http://google.com", ""), "http://google.com");
    });

    test("https://www.google.com => https://www.google.com", () => {
        assert.strictEqual(schemify("https://www.google.com", ""), "https://www.google.com");
    });

    test("ftp://example.com => ftp://example.com", () => {
        assert.strictEqual(schemify("ftp://example.com", ""), "ftp://example.com");
    });
});

describe("withoutScheme removes the protocol scheme of a URL, to display it", () => {
    test("https://github.com/johndoe => github.com/johndoe", () => {
        assert.strictEqual(withoutScheme("https://github.com/johndoe"), "github.com/johndoe");
    });

    test("HTTP://www.google.com => www.google.com", () => {
        assert.strictEqual(withoutScheme("HTTP://www.google.com"), "www.google.com");
    });

    test("linkedin.com/in/johndoe and \"Blog\" are unchanged", () => {
        assert.strictEqual(withoutScheme("linkedin.com/in/johndoe"), "linkedin.com/in/johndoe");
        assert.strictEqual(withoutScheme("Blog"), "Blog");
    });
});
