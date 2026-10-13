import { Link, Outlet, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

function DashboardLayout() {
    const location = useLocation();
    const { t } = useTranslation();

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
            <div className="w-full md:w-64 shadow-md bg-linear-to-b from-blue-50 to-white">
                <div className="md:p-6 p-2">
                    <nav className="md:hidden">
                        <Link to="/dashboard" className={`inline-block py-2 px-4 rounded transition duration-200
                             ${location.pathname === "/dashboard" ? "bg-gray-200" : ""}`}>
                            {t("dashboard.resume_previews")}
                        </Link>
                        <Link to="/dashboard/account" className={`inline-block py-2 px-4 rounded transition duration-200
                             ${location.pathname === "/dashboard/account" ? "bg-gray-200" : ""}`}>
                            {t("dashboard.account")}
                        </Link>
                    </nav>
                    <nav className="hidden md:flex flex-col gap-3">
                        <Link to="/dashboard" className={`block py-2.5 px-4 rounded transition duration-200
                             ${location.pathname === "/dashboard" ? "bg-gray-200" : ""}`}>
                            {t("dashboard.resume_previews")}
                        </Link>
                        <Link to="/dashboard/account" className={`block py-2.5 px-4 rounded transition duration-200
                             ${location.pathname === "/dashboard/account" ? "bg-gray-200" : ""}`}>
                            {t("dashboard.account")}
                        </Link>
                        <Link to="/contact" className="absolute flex gap-2 bottom-5 py-2.5 px-4 rounded-sm transition duration-200">
                            <InformationCircleIcon className="size-6" />
                            {t("dashboard.contact_support")}
                        </Link>
                    </nav>
                </div>
            </div>
            <div className="flex-1 p-10 overflow-auto">
                <Outlet />
            </div>
        </div >
    );
}

export default DashboardLayout;
