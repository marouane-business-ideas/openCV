import { HeartIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

import { TIP_URL } from "../../lib/pricing";

// Opens the Stripe page where users choose how much to tip, in a new tab. Nothing when no tip link is set
const TipLink = ({ className }: { className?: string }) => {
    const { t } = useTranslation();

    if (!TIP_URL) return null;

    return (
        <a href={TIP_URL} target="_blank" rel="noopener noreferrer" className={className}>
            <HeartIcon className="size-5" aria-hidden="true" />
            {t("common.tips.leave_a_tip")}
        </a>
    );
};

export default TipLink;
