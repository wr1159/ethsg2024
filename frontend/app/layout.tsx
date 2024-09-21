import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { headers } from "next/headers"; // added
import ContextProvider from "@/context";

const sfProRounded = localFont({
    src: "./fonts/SF-Pro-Rounded-Bold.otf",
    variable: "--font-sfpro-rounded",
    weight: "400",
});
export const metadata: Metadata = {
    title: "Co(IN)munity",
    description: "Launch your community with Co(IN)munity",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookies = headers().get("cookie");

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${sfProRounded.variable} antialiased`}>
                <ContextProvider cookies={cookies}>{children}</ContextProvider>
            </body>
        </html>
    );
}
