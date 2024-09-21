import * as React from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Chart } from "./Chart";
import { NftBuyModal } from "./NftBuyModal";
import { TokenBuyModal } from "./TokenBuyModal";

export function Community() {
    return (
        <Card className="w-full max-w-[1080px]">
            <CardHeader>
                <CardTitle>Nouns</CardTitle>
                <CardDescription>
                    Mint your Nouns community token
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-8">
                <div className="grow">
                    <Chart />
                </div>
                <div className="flex flex-col gap-4 w-62">
                    <Image
                        src="https://gateway.pinata.cloud/ipfs/QmNdUibRHNqX2byJLtCD3ofn65cfCtvXdQnV87wRjqWf96"
                        alt="Nouns"
                        width={300}
                        height={300}
                        className="rounded-lg"
                    />
                    <NftBuyModal />
                    <TokenBuyModal />
                </div>
            </CardContent>
        </Card>
    );
}
