import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import { Inter } from "next/font/google"
import GlobalLayout from "./globalLayout";

import "./global.css";

export const metadata: Metadata = {
    title: "OnlineResume",
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en" className={inter.className}>
                <body className={`overflow-auto min-h-screen ${inter.className}`}>
                    <div id="root">
                        <GlobalLayout>
                            {children}
                        </GlobalLayout>
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}