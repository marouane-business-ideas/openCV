import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react"

import Home from "./routes/Home";
import SignInPage from "./routes/SignIn"
import SignUpPage from "./routes/SignUp"

import RootLayout from "./routes/layouts/RootLayout";
import ResumeBuilder from "./routes/ResumeBuilder";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Dashboard from "./routes/Dashboard";
import DashboardLayout from "./routes/layouts/DashboardLayout";
import AccountPage from "./routes/Account";
import ProtectedRoute from "./routes/ProtectedRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "resume", element: <ResumeBuilder /> },
      { path: "resume/:resumeId", element: <ProtectedRoute><ResumeBuilder /></ProtectedRoute> },
      { path: "sign-in", element: <SignInPage /> },
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
]);


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}





const App = () => {

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  )
}

export default App
