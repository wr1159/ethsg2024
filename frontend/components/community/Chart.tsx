"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useChainId, useReadContract } from "wagmi";
import {
    coinmunityAbi,
    coinmunityAddress,
    continuousLinearTokenAbi,
    mockErc721Address,
} from "@/src/generated";
import { formatEther, formatUnits, parseEther } from "viem";

export const description = "A linear line chart";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function Chart() {
    const chainId = useChainId();
    const nftAddressResolved =
        mockErc721Address[chainId as keyof typeof mockErc721Address];
    const coinmunityAddressResolved =
        coinmunityAddress[chainId as keyof typeof coinmunityAddress];
    const { data: synthAddrss } = useReadContract({
        abi: coinmunityAbi,
        functionName: "getTokenFromCollection",
        address: coinmunityAddressResolved,
        args: [nftAddressResolved],
    });
    const { data: pricePerEther } = useReadContract({
        abi: continuousLinearTokenAbi,
        functionName: "priceForAmount",
        address: synthAddrss,
        args: [parseEther("1")],
        query: {
            refetchInterval: 10000,
        },
    });

    const populateChartData = (currPrice: bigint) => {
        const data = [];

        for (let i = 1; i <= 24; i++) {
            data.push({
                time: i.toString(),
                price: Number(formatUnits(currPrice, 18)) * i * Math.random(),
            });
        }
        return data;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>C-nouns</CardTitle>
                <CardDescription>
                    Price History
                    {pricePerEther && (
                        <span className="flex gap-x-2 rounded py-2">
                            <span className="font-medium">
                                Price per C-noun:
                            </span>
                            <span>{formatEther(pricePerEther)} ETH</span>
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={populateChartData(pricePerEther || BigInt(1))}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="price"
                            type="linear"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 700% over the last week{" "}
                    <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    );
}
