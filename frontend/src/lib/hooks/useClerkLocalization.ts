import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { frFR, enUS } from "@clerk/localizations";

const useClerkLocalization = () => {
  const { i18n } = useTranslation();
  const [clerkLocalization, setClerkLocalization] = useState(
    i18n.language.startsWith("fr") ? frFR : enUS
  );

  useEffect(() => {
    const updateLocalization = (language: string) => {
      setClerkLocalization(language.startsWith("fr") ? frFR : enUS);
    };

    // Update localization when language changes
    updateLocalization(i18n.language);

    // Listen for language changes
    i18n.on("languageChanged", updateLocalization);

    // Cleanup listener
    return () => {
      i18n.off("languageChanged", updateLocalization);
    };
  }, [i18n]);

  return clerkLocalization;
};

export default useClerkLocalization;