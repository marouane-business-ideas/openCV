import { useEffect } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import LegalEn from "../components/Legal/LegalEn";
import LegalFr from "../components/Legal/LegalFr";

// Legal notice, terms of sale and use, privacy policy. Long legal texts don't belong in translation.json: each
// language has its own version, the French one being binding. Linked to by Stripe's customer portal (#terms, #privacy)
const Legal = () => {
    const { i18n } = useTranslation();
    const { hash } = useLocation();

    // The page is rendered in the browser, after the browser (and ScrollRestoration) looked for the section the link
    // points to: scroll to it once it's there
    useEffect(() => {
        if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    }, [hash]);

    return (
        <article className="mx-auto max-w-3xl px-4 py-10 text-gray-800 leading-relaxed
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900
            [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900
            [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900
            [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1
            [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2 [&_a]:break-words">
            {i18n.language === "fr" ? <LegalFr /> : <LegalEn />}
        </article>
    );
};

export default Legal;
