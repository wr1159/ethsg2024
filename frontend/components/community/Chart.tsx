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
// import { useChainId, useReadContract } from "wagmi";
// import {
//     coinmunityAbi,
//     coinmunityAddress,
//     continuousLinearTokenAbi,
//     mockErc721Address,
// } from "@/src/generated";
// import { parseEther } from "viem";

export const description = "A linear line chart";

const chartData = [
    { time: "1", price: 0.1 },
    { time: "2", price: 0.2 },
    { time: "3", price: 0.3 },
    { time: "4", price: 0.5 },
    { time: "5", price: 0.6 },
    { time: "6", price: 0.7 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function Chart() {
    // const chainId = useChainId();
    // const nftAddressResolved =
    //     mockErc721Address[chainId as keyof typeof mockErc721Address];
    // const coinmunityAddressResolved =
    //     coinmunityAddress[chainId as keyof typeof coinmunityAddress];
    // const { data: synthAddrss } = useReadContract({
    //     abi: coinmunityAbi,
    //     functionName: "getTokenFromCollection",
    //     address: coinmunityAddressResolved,
    //     args: [nftAddressResolved],
    // });
    // const { data: pricePerEther } = useReadContract({
    //     abi: continuousLinearTokenAbi,
    //     functionName: "priceForAmount",
    //     address: synthAddrss,
    //     args: [parseEther("1")],
    // });
    // console.log(pricePerEther);
    // console.log(synthAddrss);
    return (
        <Card>
            <CardHeader>
                <CardTitle>C-nouns</CardTitle>
                <CardDescription>
                    Price History
                    {/* <div className="flex gap-x-2 rounded py-2">
                        Current Price: {pricePerEther}
                    </div> */}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
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
                {/* <div className="leading-none text-muted-foreground">
                    Showing price visitors for the last 6 months
                </div> */}
            </CardFooter>
        </Card>
    );
}
