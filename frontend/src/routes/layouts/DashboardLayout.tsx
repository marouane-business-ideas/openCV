import { Link, Outlet, useLocation } from "react-router-dom";

function DashboardLayout() {
    const location = useLocation();

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
            <div className="w-full md:w-64 bg-white shadow-md">
                <div className="md:p-6 p-2">
                    <nav className="md:hidden">
                        <Link to="/dashboard" className={`inline-block py-2 px-4 rounded transition duration-200
                             ${location.pathname === "/dashboard" ? "bg-gray-200" : ""}`}>
                            Resume Previews
                        </Link>
                        <Link to="/dashboard/account" className={`inline-block py-2 px-4 rounded transition duration-200
                             ${location.pathname === "/dashboard/account" ? "bg-gray-200" : ""}`}>
                            Account
                        </Link>
                    </nav>
                    <nav className="hidden md:flex flex-col gap-3">
                        <Link to="/dashboard" className={`block py-2.5 px-4 rounded transition duration-200
                             ${location.pathname === "/dashboard" ? "bg-gray-200" : ""}`}>
                            Resume Previews
                        </Link>
                        <Link to="/dashboard/account" className={`block py-2.5 px-4 rounded transition duration-200
                             ${location.pathname === "/dashboard/account" ? "bg-gray-200" : ""}`}>
                            Account
                        </Link>
                    </nav>
                </div>
            </div>
            <div className="flex-1 p-10 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
