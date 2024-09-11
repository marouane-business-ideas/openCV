import { Link, Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
        <div className="h-[calc(100vh-4rem)] flex">
            <div className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-xl font-semibold">Resume Builder</h1>
                    <nav className="mt-6">
                        <Link to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">
                            Resume Previews
                        </Link>
                        <Link to="/dashboard/account" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">
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
