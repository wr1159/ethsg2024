import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import Web3ModalProvider from "@/context";

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
}: {
    children: React.ReactNode;
}) {
    const initialState = cookieToInitialState(config, headers().get("cookie"));
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${sfProRounded.variable} antialiased`}>
                <Web3ModalProvider initialState={initialState}>
                    {children}
                </Web3ModalProvider>
            </body>
        </html>
    );
}
