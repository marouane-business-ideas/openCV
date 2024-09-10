import { Outlet, Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useClerk } from "@clerk/clerk-react"

import ContextProvider from "../../context/ContextProvider";

function Layout() {
    const { signOut } = useClerk();
    const location = useLocation();

    return (
        <ContextProvider >
            <div className="h-full 2xl:overflow-hidden">
                <header className={"flex h-[var(--header-height)] items-center border-b-2 px-3 lg:px-12 bg-blue-500"}>
                    <div className="flex w-full justify-between items-center text-white font-bold">
                        <Link className="lg:text-2xl text-lg" to="/">OnlineResume</Link>
                        <nav className="flex items-center gap-5 text-base">
                            <SignedIn>
                                {location.pathname !== "/dashboard" && (
                                    <Link
                                        className="bg-white text-blue-500 px-4 py-2 rounded-md transition-all duration-200
                                         hover:shadow-lg hover:scale-105"
                                        to="/dashboard">Dashboard</Link>
                                )}
                                <button
                                    onClick={() => signOut({ redirectUrl: "/" })}
                                    className="bg-white text-blue-500 px-4 py-2 rounded-md transition-all duration-200
                                     hover:shadow-lg hover:scale-105"
                                >
                                    Sign out
                                </button>
                            </SignedIn>
                            <SignedOut>
                                <Link
                                    className="bg-white text-blue-500 px-4 py-2 rounded-md transition-all duration-200
                                         hover:shadow-lg hover:scale-105"
                                    to="/sign-in">Log in</Link>
                                <Link
                                    className="bg-white text-blue-500 px-4 py-2 rounded-md transition-all duration-200
                                         hover:shadow-lg hover:scale-105"
                                    to="/sign-up">Create an account</Link>
                            </SignedOut>
                        </nav>
                    </div>
                </header>
                <main className="h-full w-full">
                    <Outlet />
                </main>
            </div>
        </ContextProvider >
    );
}

export default Layout;