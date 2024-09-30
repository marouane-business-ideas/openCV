import { Metadata } from "next";
import { Inter } from "next/font/google";
import GlobalLayout from "./globalLayout";

import ContextProvider from "../context/ContextProvider";

import "./global.css";

export const metadata: Metadata = {
    title: "OnlineResume",
    description: "Create beautiful PDF resumes online",
    keywords: ["resume", "pdf", "online", "creator", "builder", "generator"],
    creator: "Marouane Faris",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={inter.className}>
            <body className={`overflow-auto min-h-screen ${inter.className}`}>
                <ContextProvider>
                    <GlobalLayout>
                        {children}
                    </GlobalLayout>
                </ContextProvider>
            </body>
        </html>
    );
}