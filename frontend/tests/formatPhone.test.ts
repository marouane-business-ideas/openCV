import { assert, test, describe } from "vitest";
import { formatPhoneNumber } from "../src/utils/formatPhone";

describe("formatPhoneNumber - Basic formatting", () => {
    test("formats 10-digit phone number with spaces", () => {
        assert.strictEqual(formatPhoneNumber("0695034838"), "06 95 03 48 38");
    });

    test("formats 9-digit phone number with spaces", () => {
        assert.strictEqual(formatPhoneNumber("123456789"), "12 34 56 78 9");
    });

    test("formats 11-digit phone number with spaces", () => {
        assert.strictEqual(formatPhoneNumber("12345678901"), "12 34 56 78 90 1");
    });

    test("formats 8-digit phone number with spaces", () => {
        assert.strictEqual(formatPhoneNumber("12345678"), "12 34 56 78");
    });
});

describe("formatPhoneNumber - International numbers", () => {
    test("formats international number with + prefix", () => {
        assert.strictEqual(formatPhoneNumber("+33695034838"), "+33 69 50 34 83 8");
    });

    test("formats US number with +1 prefix", () => {
        assert.strictEqual(formatPhoneNumber("+15551234567"), "+15 55 12 34 56 7");
    });

    test("formats short international number", () => {
        assert.strictEqual(formatPhoneNumber("+123456"), "+12 34 56");
    });
});

describe("formatPhoneNumber - Edge cases", () => {
    test("handles empty string", () => {
        assert.strictEqual(formatPhoneNumber(""), "");
    });

    test("handles single digit", () => {
        assert.strictEqual(formatPhoneNumber("5"), "5");
    });

    test("handles two digits", () => {
        assert.strictEqual(formatPhoneNumber("12"), "12");
    });

    test("handles three digits", () => {
        assert.strictEqual(formatPhoneNumber("123"), "12 3");
    });

    test("handles only + symbol", () => {
        assert.strictEqual(formatPhoneNumber("+"), "+");
    });

    test("handles + with one digit", () => {
        assert.strictEqual(formatPhoneNumber("+1"), "+1");
    });

    test("handles + with two digits", () => {
        assert.strictEqual(formatPhoneNumber("+12"), "+12");
    });

    test("handles + with three digits", () => {
        assert.strictEqual(formatPhoneNumber("+123"), "+12 3");
    });
});


describe("formatPhoneNumber - Real world examples", () => {
    test("formats French mobile number", () => {
        assert.strictEqual(formatPhoneNumber("0695034838"), "06 95 03 48 38");
    });

    test("formats French landline number", () => {
        assert.strictEqual(formatPhoneNumber("0123456789"), "01 23 45 67 89");
    });

    test("formats international French number", () => {
        assert.strictEqual(formatPhoneNumber("+33123456789"), "+33 12 34 56 78 9");
    });

    test("formats US number", () => {
        assert.strictEqual(formatPhoneNumber("5551234567"), "55 51 23 45 67");
    });

    test("formats UK number", () => {
        assert.strictEqual(formatPhoneNumber("+447123456789"), "+44 71 23 45 67 89");
    });
});