import { useTranslation } from "react-i18next";

import { TIP_URL } from "../../lib/pricing";

// Opens the Stripe page where users choose how much to tip, in a new tab. Nothing when no tip link is set
const TipLink = ({ className }: { className?: string }) => {
    const { t } = useTranslation();

    if (!TIP_URL) return null;

    return (
        <a href={TIP_URL} target="_blank" rel="noopener noreferrer" className={className}>
            {/* Lucide's "coffee" icon (ISC license), as in "buy me a coffee" */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                <path d="M10 2v2" />
                <path d="M14 2v2" />
                <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
                <path d="M6 2v2" />
            </svg>
            {t("common.tips.leave_a_tip")}
        </a>
    );
};

export default TipLink;
