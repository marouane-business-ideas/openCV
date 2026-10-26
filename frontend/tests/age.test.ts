import { assert, test, describe } from "vitest";
import { ageFromBirthDate } from "../src/utils/age";

const on = (year: number, month: number, day: number) => new Date(year, month - 1, day);

describe("ageFromBirthDate - Age", () => {
    test("counts the years once the birthday has passed this year", () => {
        assert.strictEqual(ageFromBirthDate("1990-04-23", on(2026, 10, 26)), 36);
    });

    test("doesn't count this year before the birthday", () => {
        assert.strictEqual(ageFromBirthDate("1990-12-01", on(2026, 10, 26)), 35);
    });

    test("counts this year on the birthday", () => {
        assert.strictEqual(ageFromBirthDate("1990-10-26", on(2026, 10, 26)), 36);
    });

    test("is 0 for a baby born this year", () => {
        assert.strictEqual(ageFromBirthDate("2026-01-01", on(2026, 10, 26)), 0);
    });

    test("born on February 29: a year older on March 1 when the year has no February 29", () => {
        assert.strictEqual(ageFromBirthDate("2000-02-29", on(2027, 2, 28)), 26);
        assert.strictEqual(ageFromBirthDate("2000-02-29", on(2027, 3, 1)), 27);
    });
});

describe("ageFromBirthDate - No age", () => {
    test("without a date of birth", () => {
        assert.strictEqual(ageFromBirthDate(undefined, on(2026, 10, 26)), null);
        assert.strictEqual(ageFromBirthDate("", on(2026, 10, 26)), null);
    });

    test("for a date that isn't in the date input's format", () => {
        assert.strictEqual(ageFromBirthDate("23/04/1990", on(2026, 10, 26)), null);
    });

    test("for a day that doesn't exist", () => {
        assert.strictEqual(ageFromBirthDate("1990-02-30", on(2026, 10, 26)), null);
    });

    test("for a date in the future", () => {
        assert.strictEqual(ageFromBirthDate("2026-10-27", on(2026, 10, 26)), null);
    });
});
