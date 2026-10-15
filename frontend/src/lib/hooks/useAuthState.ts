import { useAuth } from "@clerk/clerk-react";

import useIsHydrated from "./useIsHydrated";

export type AuthState = "signed-in" | "signed-out" | "unknown";

// Set by Clerk on the app's domain: "0" when signed out, else when the session was last updated. Its name gets a
// suffix in development ("__client_uat_<id>"), next to the plain one
const SESSION_COOKIE = /^__client_uat(_\w+)?$/;

const hasSessionCookie = () => document.cookie.split("; ")
    .map((cookie) => cookie.split("="))
    .some(([name, value]) => SESSION_COOKIE.test(name) && Number(value) > 0);

// Whether the user is signed in, for UI that shouldn't wait for Clerk: Clerk takes up to several seconds to load (its
// script, then its API), while its cookie answers as soon as the page runs. Once loaded, Clerk's answer wins.
// "unknown" when the build renders the page, since it can't read the visitor's cookies
const useAuthState = (): AuthState => {
    const { isLoaded, isSignedIn } = useAuth();
    const isHydrated = useIsHydrated();

    if (isLoaded) return isSignedIn ? "signed-in" : "signed-out";
    if (!isHydrated) return "unknown";
    return hasSessionCookie() ? "signed-in" : "signed-out";
};

export default useAuthState;
