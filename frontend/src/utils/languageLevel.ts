import type { TFunction } from "i18next";
import type { LanguageLevelType } from "../context/ResumeContext";
import en from "../../locales/en/translation.json";
import fr from "../../locales/fr/translation.json";

export const LANGUAGE_LEVELS = ["native", "fluent", "intermediate", "beginner"] as const;

type LanguageLevel = Exclude<LanguageLevelType, "">;

// Resumes saved before the form saved keys hold the label the user picked, in the language of the app ("Débutant")
const keysByText = new Map<string, LanguageLevel>(LANGUAGE_LEVELS.flatMap((key) => [
    [key, key],
    [en.form.languages.levels[key].toLowerCase(), key],
    [fr.form.languages.levels[key].toLowerCase(), key],
]));

export const languageLevelKey = (level: string): LanguageLevel | undefined => keysByText.get(level.trim().toLowerCase());

// The level in the language of the app, or as saved when it isn't a known level
export const languageLevelLabel = (level: string, t: TFunction) => {
    const key = languageLevelKey(level);
    return key ? t(`form.languages.levels.${key}`) : level;
};
