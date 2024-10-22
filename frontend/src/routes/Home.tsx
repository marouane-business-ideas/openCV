import { useContext } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import ProfessionalTemplate from "../components/ResumeModels/ProfessionalTemplate";
import ClassicalTemplate from "../components/ResumeModels/ClassicalTemplate";
import { getResumeDummyData, ResumeContext } from "../context/ResumeContext";
import PricingCard from "../components/PricingCard/PricingCard";

const Home: React.FC = () => {
    const { isSignedIn } = useUser();
    const { accountType } = useContext(ResumeContext);

    const isPremium = accountType?.type === "premium";

    return (
        <div className="h-full px-3 lg:py-36 py-20">
            <section className="mx-auto max-w-screen-lg">
                <h1 className="text-center lg:text-5xl text-3xl font-bold tracking-tight">Build amazing resumes in minutes</h1>
                <h2 className="mx-auto mt-5 max-w-screen-md text-center lg:text-xl text-lg">
                    Land your dream job with our carefully crafted resume templates.
                </h2>
            </section>
            <section className="mt-20">
                <Link className="mx-auto w-32 block px-5 py-3 hover:bg-blue-600 bg-blue-500 text-white font-bold rounded-lg" to="/resume">
                    Get started
                </Link>
            </section>
            <section className="mt-16 text-center">
                <div className="rounded-lg p-8 max-w-2xl mx-auto">
                    <h3 className="lg:text-2xl text-lg font-semibold mb-4">{`${isPremium ? "Premium" : "Free"} Plan Highlight`}</h3>
                    <div className="flex items-center justify-center space-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="lg:h-12 lg:w-12 h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0
                             1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        <p className="lg:text-xl text-base">
                            {isPremium ?
                                <><span className="font-bold text-blue-600">Unlimited </span>resume downloads</>
                                :
                                <>Download up to <span className="font-bold text-blue-600">5 resumes</span> for free!</>
                            }
                        </p>
                    </div>
                </div>
            </section>
            <section className="mt-8 text-center">
                <div className="bg-yellow-100 rounded-lg p-4 max-w-4xl mx-auto">
                    <p className="lg:text-lg text-base">
                        <span className="font-semibold">Coming Soon:</span> New resume templates!
                        <span className="ml-2 animate-pulse inline-block">🎉</span>
                    </p>
                </div>
            </section>
            <section className="flex flex-col items-center md:flex-row md:justify-center mt-16">
                <div className="flex flex-col items-center bg-white m-8 shadow-gray-200 shadow-xl relative overflow-hidden"
                    style={{ minWidth: "320px", maxWidth: "320px", minHeight: "450px", maxHeight: "450px" }} >
                    <div aria-description="Professional resume template" className="flex relative overflow-hidden">
                        <ProfessionalTemplate inert customStyle={{ minWidth: "840px", transform: "scale(0.4)", transformOrigin: "top" }}
                            resume={getResumeDummyData()} />
                    </div>
                </div>
                <div className="flex flex-col items-center bg-white m-8 shadow-gray-200 shadow-xl relative overflow-hidden"
                    style={{ minWidth: "320px", maxWidth: "320px", minHeight: "450px", maxHeight: "450px" }} >
                    <div aria-description="Classical resume template" className="flex relative overflow-hidden">
                        <ClassicalTemplate inert customThemeColor="#7A6C55"
                            customStyle={{ minWidth: "840px", transform: "scale(0.37)", transformOrigin: "top" }}
                            resume={getResumeDummyData("classic")} />
                    </div>
                </div>
            </section>
            <section className="mt-28 flex flex-col items-center md:flex-row justify-center gap-8">
                {isSignedIn === false && <PricingCard
                    name="Free plan"
                    title="Gets you up and running"
                    price={0}
                    featuresList={["5 resume downloads", "No credit card info required !", "No hidden fees !"]}
                    link="/sign-up?redirect_url=/resume"
                />}
                {!isPremium && <PricingCard
                    name="Premium plan"
                    title="Unlimited resume downloads"
                    price={6}
                    featuresList={[
                        'Unlimited access to all features',
                        'Priority customer support',
                        'Much more ...',
                    ]}
                    link={`${isSignedIn ? "/subscribe" : "/sign-up?redirect_url=/subscribe"}`}
                    footNote="Price available for first 100 subscribers only !"
                />}
            </section>
        </div>
    );
};

export default Home;