import { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigate } from "react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

import "./index.css";
import "./i18n";
import ContextProvider from "./context/ContextProvider";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import useClerkLocalization from "./lib/hooks/useClerkLocalization";
import { useHomePath } from "./lib/homePath";
import useIsHydrated from "./lib/hooks/useIsHydrated";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

// The HTML document of every page
export function Layout({ children }: { children: ReactNode }) {
    const { i18n } = useTranslation();

    return (
        <html lang={i18n.language}>
            <head>
                <meta charSet="UTF-8" />
                <link rel="icon" type="image/png" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                {/* HTML Meta Tags */}
                <title>OnlineResume</title>
                <meta name="description" content="Easily create PDF resume with our templates" />

                {/* Facebook Meta Tags */}
                <meta property="og:url" content="https://onlineresume.dev/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="OnlineResume" />
                <meta property="og:description" content="Easily create PDF resume with our templates" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1000" />
                <meta property="og:image:height" content="600" />
                <meta property="og:image" content="http://onlineresume.dev/logo.png" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="onlineresume.dev" />
                <meta property="twitter:url" content="https://onlineresume.dev/" />
                <meta name="twitter:title" content="OnlineResume" />
                <meta name="twitter:description" content="Easily create PDF resume with our templates" />
                <meta name="twitter:image" content="http://onlineresume.dev/logo.png" />
                <Meta />
                <Links />
            </head>
            <body className="overflow-auto min-h-screen bg-linear-to-b from-blue-50 to-white">
                <div className="h-full" id="root">{children}</div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

// Shown instead of the page when it fails, or when no page matches the URL
export function ErrorBoundary() {
    // When the page fails to load, React first takes over the HTML sent by the server, which has no error page
    return useIsHydrated() ? <ErrorPage /> : null;
}

// Shown until the JavaScript takes over the page
export function HydrateFallback() {
    return null;
}

export default function App() {
    const clerkLocalization = useClerkLocalization();
    const homePath = useHomePath();
    const navigate = useNavigate();

    return (
        <ClerkProvider
            localization={clerkLocalization}
            publishableKey={PUBLISHABLE_KEY}
            afterSignOutUrl={homePath}
            // After signing in or up, users land on the resume builder, unless the link they came from says otherwise
            // (redirect_url, like the premium plan's sign-up going to /subscribe)
            signInFallbackRedirectUrl="/resume"
            signUpFallbackRedirectUrl="/resume"
            // Clerk's own navigations (after signing in or out, between sign-in steps) stay in the app: without these,
            // Clerk reloads the whole page, and the header waits for Clerk to load again
            routerPush={(to) => navigate(to)}
            routerReplace={(to) => navigate(to, { replace: true })}
        >
            <ContextProvider>
                <Outlet />
            </ContextProvider>
        </ClerkProvider>
    );
}
