import { useState, useRef, useEffect, useContext } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/clerk-react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

import useGetUserAccountType from "../../lib/hooks/useGetUserAccountType";
import { ResumeContext } from "../../context/ResumeContext";

function Layout() {
    const { signOut } = useClerk();
    const { isSignedIn } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { accountType } = useContext(ResumeContext);

    useGetUserAccountType();

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

    // I want to prevent Premium users for seeing the landing page (As of now, it is suited to logged out and free plan users, not premium users)
    useEffect(() => {
        if (isSignedIn && location.pathname === "/" && accountType.type === "premium") {
            navigate("/resume");
        }
    }, [isSignedIn, accountType, navigate, location]);

    return (
        <div className="h-full">
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
                                to="/sign-in?redirect_url=/resume">Login</Link>
                            <Link
                                className="bg-white text-blue-500 px-4 py-2 rounded-md transition-all duration-200
                                         hover:shadow-lg hover:scale-105"
                                to="/sign-up?redirect_url=/resume">Create an account</Link>
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
                {location.pathname === "/" &&
                    <footer className="flex justify-center w-full text-xs md:text-sm">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center space-x-4">
                                {isSignedIn ?
                                    <Link to="/contact">
                                        <EnvelopeIcon className="size-6" />
                                    </Link>
                                    :
                                    <a href="mailto:support@onlineresume.dev">
                                        <EnvelopeIcon className="size-6" />
                                    </a>
                                }
                                <a href="https://www.linkedin.com/in/marouane-faris-1514b970/" target="_blank" rel="noopener noreferrer">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"
                                        aria-label="https://www.linkedin.com/company/node-js"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5
                                      1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3
                                       6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0
                                        000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                                    </svg>
                                </a>
                            </div>
                            <div className="px-5 pb-8 mt-8">
                                Copyright ©
                                {new Date().getFullYear()}
                                {" "}Made with ❤️ by <a target="_blank" className="underline underline-offset-4"
                                    href="https://www.marouanefaris.dev/">
                                    Marouane Faris
                                </a>
                            </div>
                        </div>
                    </footer>
                }
            </main>
        </div>
    );
}

export default Layout;