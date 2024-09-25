import NavBar from "./navBar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
            <div className="w-full md:w-64 bg-white shadow-md">
                <NavBar />
            </div>
            <div className="flex-1 p-10 overflow-auto">
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;
