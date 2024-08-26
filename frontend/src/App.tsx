import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import SignInPage from "./routes/SignIn"
import SignUpPage from "./routes/SignUp"

import Layout from "./routes/layouts/RootLayout";
import ResumeBuilder from "./routes/ResumeBuilder";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Dashboard from "./routes/Dashboard";
import DashboardLayout from "./routes/layouts/DashboardLayout";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/resume", element: <ResumeBuilder /> },
      { path: "/sign-in/*", element: <SignInPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        path: "/dashboard", element: <DashboardLayout />, children: [
          { index: true, element: <Dashboard /> },
          { path: "/dashboard/account", element: <div>Account</div> },
        ]
      },

    ],
  },
]);





const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
