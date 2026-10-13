import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { getHomePath, isHomePath } from "../../lib/homePath";


const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = i18n.language;

  const languages = [
    { code: "en", name: t("common.language.english"), flag: "🇺🇸" },
    { code: "fr", name: t("common.language.french"), flag: "🇫🇷" }
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    // On the home page, the language is in the URL
    if (isHomePath(location.pathname)) {
      navigate(getHomePath(languageCode) + location.search);
    }
    setIsOpen(false);
  };

  const handleLanguageToggle = () => {
    setIsOpen(!isOpen);
    handleLanguageChange(currentLanguage === "en" ? "fr" : "en");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="relative flex items-center space-x-4 mb-4" ref={dropdownRef}>
      <button
        onClick={handleLanguageToggle}
        className="cursor-pointer flex items-center space-x-2 text-gray-700 px-3 py-2 rounded-md transition-all duration-200
            hover:bg-gray-200 hover:shadow-md text-sm"
        aria-label={t("common.language.toggle")}
      >
        <span className="text-2xl font-medium">
          {languages.find(lang => lang.code !== currentLanguage)?.flag}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;