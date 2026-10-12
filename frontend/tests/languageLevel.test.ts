import { assert, test, describe } from "vitest";

import { languageLevelKey } from "../src/utils/languageLevel";

describe("languageLevelKey finds the level of what the form saves", () => {
    test("keys, saved by the form", () => {
        assert.strictEqual(languageLevelKey("beginner"), "beginner");
        assert.strictEqual(languageLevelKey("native"), "native");
    });

    test("English and French labels, saved by older versions of the form", () => {
        assert.strictEqual(languageLevelKey("Beginner"), "beginner");
        assert.strictEqual(languageLevelKey("Débutant"), "beginner");
        assert.strictEqual(languageLevelKey("Langue maternelle"), "native");
        assert.strictEqual(languageLevelKey("Bilingue"), "fluent");
    });

    test("nothing for an empty or unknown level", () => {
        assert.strictEqual(languageLevelKey(""), undefined);
        assert.strictEqual(languageLevelKey("Expert"), undefined);
    });
});
