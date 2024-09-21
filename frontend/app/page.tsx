"use client";

import { Community } from "@/components/community";
import { Navbar } from "@/components/navbar";

// import { useAccount } from "wagmi";

export default function Home() {
    // const { isConnected } = useAccount();

    return (
        <main className="min-h-screen px-8 py-0 pb-12 flex-1 flex flex-col items-center">
            <Navbar />
            <Community />
        </main>
    );
}
