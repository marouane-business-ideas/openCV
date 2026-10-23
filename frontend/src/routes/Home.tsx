import { useContext } from "react";
import { Link, type ClientLoaderFunctionArgs } from "react-router";
import { useTranslation, Trans } from "react-i18next";

import ProfessionalTemplate from "../components/ResumeModels/ProfessionalTemplate";
import ClassicalTemplate from "../components/ResumeModels/ClassicalTemplate";
import ModernTemplate from "../components/ResumeModels/ModernTemplate";
import { getResumeDummyData, ResumeContext } from "../context/ResumeContext";
import PricingCard from "../components/PricingCard/PricingCard";
import MiniResumePreview from "../components/MiniResumePreview/MiniResumePreview";
import i18n from "../i18n";
import { getHomePathLanguage, homePaths, SITE_URL, useHomePath } from "../lib/homePath";
import useIsHydrated from "../lib/hooks/useIsHydrated";
import useAuthState from "../lib/hooks/useAuthState";
import { FREE_FOR_EVERYONE } from "../lib/pricing";

// The home page shows the language of its URL, also when reached from another page or with the browser's back and
// forward buttons. Runs in the browser before the page is shown, so that it is rendered in that language right away
// (on the first load, i18n.ts already picked the language of the URL)
export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
    await i18n.changeLanguage(getHomePathLanguage(new URL(request.url).pathname));
    return null;
}

// Runs only when the build writes the page (entry.server.tsx sets its language). Without it, React Router would wait
// for the clientLoader before showing the page, so the build would write an empty page
export function loader() {
    return null;
}

const Home: React.FC = () => {
    // Doesn't wait for Clerk to load (see useAuthState). The build writes the signed-out version
    const isSignedIn = useAuthState() === "signed-in";
    const { accountType } = useContext(ResumeContext);
    const { t } = useTranslation();
    const homePath = useHomePath();

    // The build renders this page for visitors without a saved account type: premium users see their version once
    // the saved one is read
    const isPremium = useIsHydrated() && accountType?.type === "premium";

    // Free for everyone: no plan to highlight, nor to sell (see lib/pricing.ts)
    const highlightTitle = FREE_FOR_EVERYONE ? t("home.free_for_everyone_title")
        : t("home.plan_highlight", { plan: isPremium ? t("home.premium") : t("home.free") });
    const highlightKey = FREE_FOR_EVERYONE ? "home.free_for_everyone_highlight"
        : isPremium ? "home.premium_plan_secondary_highlight" : "home.free_plan_secondary_highlight";

    return (
        <div className="h-full px-3 lg:py-36 py-20">
            {/* Tell search engines that the home page exists in each language (React places these in <head>) */}
            <link rel="canonical" href={SITE_URL + homePath} />
            {Object.entries(homePaths).map(([language, path]) =>
                <link key={language} rel="alternate" hrefLang={language} href={SITE_URL + path} />
            )}
            <link rel="alternate" hrefLang="x-default" href={SITE_URL + homePaths.en} />
            <section className="mx-auto max-w-(--breakpoint-lg)">
                <h1 className="text-center lg:text-5xl text-3xl font-bold tracking-tight">
                    {t("home.title")}
                </h1>
                <h2 className="mx-auto mt-5 max-w-(--breakpoint-md) text-center lg:text-xl text-lg">
                    {t("home.secondary_title")}
                </h2>
            </section>
            <section className="mt-20">
                <Link
                    data-testid="home-get-started-button"
                    className="mx-auto w-fit block px-5 py-3 hover:bg-blue-600 bg-blue-500 text-white font-bold rounded-lg"
                    to="/resume">
                    {t("common.buttons.get_started")}
                </Link>
            </section>
            <section className="mt-16 text-center">
                <div className="rounded-lg p-8 max-w-2xl mx-auto">
                    <h3 className="lg:text-2xl text-lg font-semibold mb-4">
                        {highlightTitle}
                    </h3>
                    <div className="flex items-center justify-center space-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="lg:h-12 lg:w-12 h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0
                             1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        <p className="lg:text-xl text-base">
                            <Trans
                                i18nKey={highlightKey}
                                components={{ span: <span className="font-bold text-blue-600" /> }}
                            />
                        </p>
                    </div>
                </div>
            </section>
            <section className="mt-8 text-center">
                <div className="bg-yellow-100 rounded-lg p-4 max-w-4xl mx-auto">
                    <p className="lg:text-lg text-base">
                        <Trans
                            i18nKey="home.coming_soon"
                            components={{ span: <span className="font-semibold" /> }}
                        />
                        <span className="ml-2 animate-pulse inline-block">🎉</span>
                    </p>
                </div>
            </section>
            <section className="flex flex-col items-center md:flex-row md:flex-wrap md:justify-center mt-16">
                <MiniResumePreview>
                    <ProfessionalTemplate customStyle={{ minWidth: "840px", transform: "scale(0.4)", transformOrigin: "top" }}
                        resume={getResumeDummyData()} />
                </MiniResumePreview>
                <MiniResumePreview>
                    <ClassicalTemplate customThemeColor="#7A6C55"
                        customStyle={{ minWidth: "840px", transform: "scale(0.37)", transformOrigin: "top" }}
                        resume={getResumeDummyData("classic")} />
                </MiniResumePreview>
                <MiniResumePreview>
                    <ModernTemplate customStyle={{ marginTop: "10px", transform: "scale(0.41)", transformOrigin: "top" }}
                        resume={getResumeDummyData("modern")} />
                </MiniResumePreview>
            </section>
            {!FREE_FOR_EVERYONE && <section className="mt-28 flex flex-col items-center md:flex-row justify-center gap-8">
                {!isSignedIn && <PricingCard
                    name={t("common.pricing_card.free_plan.title")}
                    title={t("common.pricing_card.free_plan.secondary_title")}
                    price={0}
                    featuresList={[
                        t("common.pricing_card.free_plan.feature_1"),
                        t("common.pricing_card.free_plan.feature_2"),
                        t("common.pricing_card.free_plan.feature_3"),
                    ]}
                    link="/sign-up?redirect_url=/resume"
                />}
                {!isPremium && <PricingCard
                    name={t("common.pricing_card.premium_plan.title")}
                    title={t("common.pricing_card.premium_plan.secondary_title")}
                    price={6}
                    featuresList={[
                        t("common.pricing_card.premium_plan.feature_1"),
                        t("common.pricing_card.premium_plan.feature_2"),
                        t("common.pricing_card.premium_plan.much_more"),
                    ]}
                    link={`${isSignedIn ? "/subscribe" : "/sign-up?redirect_url=/subscribe"}`}
                    footNote={t("common.pricing_card.premium_plan.footnote")}
                />}
            </section>}
        </div>
    );
};

export default Home;