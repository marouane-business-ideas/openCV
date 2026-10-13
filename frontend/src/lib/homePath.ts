import { useTranslation } from "react-i18next";

import type { Language } from "../i18n";

export const SITE_URL = "https://onlineresume.dev";

// The home page is the only page whose URL carries its language, so that it can be pre-rendered in each language.
// Nginx sends French users who open "/" to "/fr" (see nginx.conf).
export const homePaths: Record<Language, string> = { en: "/", fr: "/fr" };

// The language of the home page at this path, undefined when the path isn't the home page
export const getHomePathLanguage = (pathname: string) => {
    const path = pathname.replace(/\/+$/, "") || "/";
    return (Object.keys(homePaths) as Language[]).find((language) => homePaths[language] === path);
};

export const isHomePath = (pathname: string) => getHomePathLanguage(pathname) !== undefined;

export const getHomePath = (language: string) => homePaths[language as Language] ?? homePaths.en;

// Links to the home page keep the language shown
export const useHomePath = () => {
    const { i18n } = useTranslation();
    return getHomePath(i18n.language);
};
