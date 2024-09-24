import { Metadata } from "next";
import { Inter } from "next/font/google"

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
        <html lang="en" className={inter.className}>
            <body className={`overflow-auto min-h-screen ${inter.className}`}>
                <div id="root">{children}</div>
            </body>
        </html>
    )
}