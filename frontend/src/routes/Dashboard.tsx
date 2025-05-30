import { useContext } from "react";
import { Link } from "react-router";
import { useAuth, useUser } from "@clerk/clerk-react";
import useSWR from "swr";
import { useTranslation } from "react-i18next";

import SkeletonLoader from "../components/SkeletonLoader";
import PdfCard from "../components/PdfCard/PdfCard";
import { IPdf } from "../Types/CommonTypes";
import fetcher from "../lib/fetcher/fetcher";
import { ResumeContext } from "../context/ResumeContext";


function Dashboard() {
    const { user, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const { accountType } = useContext(ResumeContext);
    const { t } = useTranslation();

    const { data, error, isLoading } = useSWR(isSignedIn ? `/api/users/${user.id}/pdfs` : null, async (url) => {
        const token = await getToken();
        return fetcher(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
    });

    return (
        <>
            <header className="mb-6 flex justify-between items-center">
                <h2 className="text-3xl text-center md:text-left w-full md:w-fit font-semibold mb-4">{t("dashboard.title")}</h2>
                <Link to="/resume" className="bg-blue-500 text-white py-2 px-4 hidden lg:block rounded-lg shadow-md
                 hover:bg-blue-600 transition duration-200"
                    aria-label="Create New Resume">
                    {t("dashboard.create_new_resume")}
                </Link>
            </header>
            {error ? <p className="text-sm text-center text-red-500">
                {t("dashboard.error_fetching_pdfs")}
            </p> :
                <div className="dashboard-grid flex flex-wrap justify-center xl:justify-normal">
                    {isLoading ? (
                        Array(3).fill(0).map((_, index) => (
                            <SkeletonLoader key={index} />
                        ))
                    ) : data?.length > 0 ? (
                        data.map((pdf: IPdf) => (
                            <PdfCard key={pdf.id} pdf={pdf} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">
                            {t("dashboard.no_resumes_found_error")}{" "}
                            <Link to="/resume" className="underline underline-offset-2 hover:underline-offset-4" aria-label="Create New Resume">
                                {t("dashboard.create_first_resume")}
                            </Link>
                        </p>
                    )}
                </div>
            }

            <div className="mt-8 w-full flex flex-col lg:w-2/4">
                <h3 className="text-2xl text-center lg:text-left font-semibold mb-4">{t("dashboard.account_information")}</h3>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {user && <p className="text-xl font-semibold">{user.fullName}</p>}
                    {user && <p className="mt-2 text-gray-500">Email: {user.emailAddresses[0].emailAddress}</p>}
                    <p className="mt-2 text-gray-500">
                        {t("dashboard.subscription")}: {accountType.type === "free" ? t("dashboard.free_subscription") : t("dashboard.premium_subscription")}
                    </p>
                    <Link to="/dashboard/account" className="flex items-center justify-center mt-4 w-full bg-blue-500 text-white py-2
                         px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                        {t("dashboard.edit_account")}
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
