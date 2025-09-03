import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';


const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = i18n.language;

  const languages = [
    { code: 'en-US', name: t('common.language.english'), flag: '🇺🇸' },
    { code: 'fr', name: t('common.language.french'), flag: '🇫🇷' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dropdownPosition = 'top-full mt-2';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center space-x-2 text-gray-700 px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-200 hover:shadow-md text-sm"
        aria-label={t('common.language.toggle')}
      >
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === currentLanguage)?.flag}
        </span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 ${dropdownPosition} w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200`}>
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 ${currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <span className="ml-auto">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;