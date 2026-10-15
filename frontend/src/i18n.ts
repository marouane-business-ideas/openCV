import i18n, { LanguageDetectorModule } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en/translation.json";
import fr from "../locales/fr/translation.json";
import { getHomePathLanguage } from "./lib/homePath";

export const supportedLanguages = ["en", "fr"] as const;
export type Language = typeof supportedLanguages[number];

// Remembers the language the user picked. Read by nginx too, to send French users to the French home page
const LANGUAGE_COOKIE = "lang";
const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

const isBrowser = typeof window !== "undefined";

const readLanguageCookie = () =>
    document.cookie.split("; ").find((cookie) => cookie.startsWith(`${LANGUAGE_COOKIE}=`))?.split("=")[1];

const languageDetector: LanguageDetectorModule = {
    type: "languageDetector",
    // The language of the home page URL ("/" or "/fr"), else the language the user picked, else the browser's
    // languages in order of preference. i18next keeps the first supported one, ignoring the region ("en-GB" gives
    // "en"), and falls back to fallbackLng (also when the build renders pages, outside the browser)
    detect: () => {
        if (!isBrowser) return undefined;
        return getHomePathLanguage(window.location.pathname) ?? readLanguageCookie() ?? [...navigator.languages];
    },
    cacheUserLanguage: (language) => {
        if (!isBrowser) return;
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secure}`;
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr }
        },
        debug: import.meta.env.VITE_I18N_DEBUG_MODE, // Enable debug mode in development mode
        supportedLngs: supportedLanguages,
        fallbackLng: "en", // Fallback language if detection fails
        interpolation: { escapeValue: false },
    });

// React keeps <html lang> in line with the language (see root.tsx), but the HTML sent by the server may be in
// another language: correct it before React takes over the page
if (isBrowser) {
    document.documentElement.lang = i18n.language;
}

export default i18n;
