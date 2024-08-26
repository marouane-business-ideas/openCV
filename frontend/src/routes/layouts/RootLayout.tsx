import { Outlet, Link, useNavigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"

import ContextProvider from "../../context/ContextProvider";


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}





function Layout() {
    const navigate = useNavigate();

    return (
        <ContextProvider >
            <ClerkProvider
                routerPush={(to) => navigate(to)}
                routerReplace={(to) => navigate(to, { replace: true })}
                publishableKey={PUBLISHABLE_KEY}
            >
                <div className=" 2xl:overflow-hidden">
                    <header className={"flex h-[var(--header-height)] items-center border-b-2 px-3 lg:px-12 bg-blue-500"}>
                        <div className="flex w-full justify-between items-center text-white font-bold text-2xl">
                            <Link to="/">OpenCV</Link>
                            <nav className="flex items-center gap-5 text-base">
                                <SignedIn>
                                    <UserButton />
                                    <Link to="/dashboard">Dashboard</Link>
                                </SignedIn>
                                <SignedOut>
                                    <Link to="/sign-up">Create an account</Link>
                                    <Link to="/sign-in">Log in</Link>
                                </SignedOut>
                            </nav>
                        </div>
                    </header>
                    <main className="h-full w-full">
                        <Outlet />
                    </main>
                </div>
            </ClerkProvider>
        </ContextProvider >
    );
}

export default Layout;