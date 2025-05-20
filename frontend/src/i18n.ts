import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en/translation.json";
import fr from "../locales/fr/translation.json";

i18n
    .use(LanguageDetector) // Automatically detects the browser language
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr }
        },
        debug: import.meta.env.VITE_I18N_DEBUG_MODE, // Enable debug mode in development mode
        fallbackLng: "en", // Fallback language if detection fails
        interpolation: { escapeValue: false },
        detection: {
            // Configurations for language detection
            order: ["navigator"],
        }
    });

export default i18n;
