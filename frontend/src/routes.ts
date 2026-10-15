import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("./routes/layouts/RootLayout.tsx", [
        index("./routes/Home.tsx", { id: "home-en" }),
        route("fr", "./routes/Home.tsx", { id: "home-fr" }),
        route("resume", "./routes/ResumeBuilder.tsx", { id: "resume" }),
        route("resume/preview", "./routes/ResumePreview.tsx", { id: "resume-preview" }),
        route("resume/:resumeId/preview", "./routes/ResumePreview.tsx", { id: "saved-resume-preview" }),
        route("sign-in", "./routes/SignIn.tsx"),
        route("sign-in/sso-callback", "./routes/SsoCallback.tsx"),
        route("sign-up/*", "./routes/SignUp.tsx"),
        layout("./routes/layouts/ProtectedLayout.tsx", { id: "protected-in-layout" }, [
            route("resume/:resumeId", "./routes/ResumeBuilder.tsx", { id: "saved-resume" }),
            route("dashboard", "./routes/layouts/DashboardLayout.tsx", [
                index("./routes/Dashboard.tsx"),
                route("account", "./routes/Account.tsx"),
            ]),
        ]),
    ]),
    // Without the header and footer
    layout("./routes/layouts/ProtectedLayout.tsx", { id: "protected" }, [
        route("contact", "./routes/ContactPage.tsx"),
        route("subscribe", "./routes/Subscribe.tsx"),
    ]),
] satisfies RouteConfig;
