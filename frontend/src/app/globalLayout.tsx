"use client";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


function GlobalLayout({ children }: { children: ReactNode }) {
    const { signOut } = useClerk();
    const pathname = usePathname();
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
    }, [pathname]);

    return (
        <div className="h-full">
            <header className={"flex h-[var(--header-height)] items-center border-b-2 px-3 lg:px-12 bg-blue-500"}>
                <div className="flex w-full justify-between items-center text-white font-bold">
                    <Link className="lg:text-2xl text-lg" href="/">OnlineResume</Link>

                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ☰
                    </button>

                    <nav role="navigation" className="hidden lg:flex items-center gap-5 text-base">
                        <SignedIn>
                            {pathname !== "/dashboard" && (
                                <Link
                                    className="bg-white text-blue-500 px-4 py-2 rounded-md transition-all duration-400
                                         hover:shadow-lg hover:scale-105"
                                    href="/dashboard">Dashboard</Link>
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
                                href="/sign-in">Login</Link>
                            <Link
                                className="bg-white text-blue-500 px-4 py-2 rounded-md transition-all duration-200
                                         hover:shadow-lg hover:scale-105"
                                href="/sign-up">Create an account</Link>
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
                        {pathname !== "/dashboard" && (
                            <Link
                                className="block bg-white text-blue-500 px-4 py-2 rounded-md mb-2 text-center"
                                href="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
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
                                href="/sign-in" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link
                                className="block bg-white text-blue-500 px-4 py-2 rounded-md mb-2 w-full text-center"
                                href="/sign-up" onClick={() => setIsMenuOpen(false)}>Create an account</Link>
                        </div>
                    </SignedOut>
                </nav>
            </div>

            <main className="h-full w-full">
                {children}
                {pathname === "/" && <footer className="flex justify-center w-full text-xs md:text-sm">
                    <div className="px-5 pb-8">
                        Copyright
                        {new Date().getFullYear()}
                        {" "}Made with ❤️ by{" "}
                        <a
                            target="_blank"
                            className="underline underline-offset-4"
                            href="https://marouanefaris.dev/"
                        >
                            Marouane Faris
                        </a>
                    </div>
                </footer>
                }
            </main>
        </div>
    );
}

export default GlobalLayout;