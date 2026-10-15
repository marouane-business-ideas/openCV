import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const SsoCallback = () => <AuthenticateWithRedirectCallback signInUrl="/sign-in" signUpUrl="/sign-up" />;

export default SsoCallback;
