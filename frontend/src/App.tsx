import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthenticateWithRedirectCallback, ClerkProvider } from "@clerk/clerk-react";

import Home from "./routes/Home";
import SignInPage from "./routes/SignIn";
import SignUpPage from "./routes/SignUp";

import RootLayout from "./routes/layouts/RootLayout";
import ResumeBuilder from "./routes/ResumeBuilder";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Dashboard from "./routes/Dashboard";
import DashboardLayout from "./routes/layouts/DashboardLayout";
import AccountPage from "./routes/Account";
import ProtectedRoute from "./routes/ProtectedRoute";
import SubscribePage from "./routes/Subscribe";
import ContactPage from "./routes/ContactPage";
import ContextProvider from "./context/ContextProvider";
import PdfViewer from "./features/PdfViewer/PdfViewer";
import useClerkLocalization from "./lib/hooks/useClerkLocalization";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "resume", element: <ResumeBuilder /> },
      { path: "resume/preview", element: <PdfViewer edited={false} /> },
      { path: "resume/:resumeId", element: <ProtectedRoute><ResumeBuilder /></ProtectedRoute> },
      { path: "resume/:resumeId/preview", element: <PdfViewer edited /> },
      { path: "sign-in", element: <SignInPage /> },
      { path: "sign-in/sso-callback", element: <AuthenticateWithRedirectCallback signInUrl="/sign-in" signUpUrl="/sign-up" /> },
      { path: "sign-up/*", element: <SignUpPage /> },
      {
        path: "/dashboard",
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "account", element: <AccountPage /> },
        ]
      },
    ],
  },
  { path: "contact", element: <ProtectedRoute><ContactPage /></ProtectedRoute> },
  { path: "subscribe", element: <ProtectedRoute><SubscribePage /></ProtectedRoute> },
]);


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const App = () => {
  const clerkLocalization = useClerkLocalization();
  
  return (
    <ClerkProvider
      localization={clerkLocalization}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </ClerkProvider>
  );
};

export default App;
