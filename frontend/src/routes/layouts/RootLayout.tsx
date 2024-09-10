import { Outlet, Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, useClerk } from "@clerk/clerk-react"
import { useState, useRef, useEffect } from "react";
import ContextProvider from "../../context/ContextProvider";

function Layout() {
    const { signOut } = useClerk();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (menuRef.current) {
            if (isMenuOpen) {
                menuRef.current.style.maxHeight = `${menuRef.current.scrollHeight}px`;
            } else {
                menuRef.current.style.maxHeight = "0px";
            }
        }
    }, [isMenuOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <ContextProvider >
            <div className="h-full 2xl:overflow-hidden">
                <header className={"flex h-[var(--header-height)] items-center border-b-2 px-3 lg:px-12 bg-blue-500"}>
                    <div className="flex w-full justify-between items-center text-white font-bold">
                        <Link className="lg:text-2xl text-lg" to="/">OnlineResume</Link>

                        <button
                            className="lg:hidden text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            ☰
                        </button>

                        <nav role="navigation" className="hidden lg:flex items-center gap-5 text-base">
                            <SignedIn>
                                {location.pathname !== "/dashboard" && (
                                    <Link
                                        className="bg-white text-blue-500 px-4 py-2 rounded-md transition-all duration-400
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
                                    to="/sign-in">Login</Link>
                                <Link
                                    className="bg-white text-blue-500 px-4 py-2 rounded-md transition-all duration-200
                                         hover:shadow-lg hover:scale-105"
                                    to="/sign-up">Create an account</Link>
                            </SignedOut>
                        </nav>
                    </div>
                </header>

                <div
                    ref={menuRef}
                    className={"lg:hidden bg-blue-500 text-white overflow-hidden transition-all duration-300 ease-in-out"}
                    style={{ maxHeight: "0px" }}
                >
                    <nav role="navigation" className="p-4">
                        <SignedIn>
                            {location.pathname !== "/dashboard" && (
                                <Link
                                    className="block bg-white text-blue-500 px-4 py-2 rounded-md mb-2 text-center"
                                    to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            )}
                            <button
                                onClick={() => { signOut({ redirectUrl: "/" }); setIsMenuOpen(false); }}
                                className="block w-full bg-white text-blue-500 px-4 py-2 rounded-md mb-2"
                            >
                                Sign out
                            </button>
                        </SignedIn>
                        <SignedOut>
                            <div className="flex flex-col items-center">
                                <Link
                                    className="block bg-white text-blue-500 px-4 py-2 rounded-md mb-2 w-full text-center"
                                    to="/sign-in" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                <Link
                                    className="block bg-white text-blue-500 px-4 py-2 rounded-md mb-2 w-full text-center"
                                    to="/sign-up" onClick={() => setIsMenuOpen(false)}>Create an account</Link>
                            </div>
                        </SignedOut>
                    </nav>
                </div>

                <main className="h-full w-full">
                    <Outlet />
                </main>
            </div>
        </ContextProvider >
    );
}

export default Layout;