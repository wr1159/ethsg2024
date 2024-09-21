import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    useAccount,
    useBalance,
    useChainId,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import { formatEther, formatUnits, parseEther } from "viem";
import {
    coinmunityAbi,
    coinmunityAddress,
    continuousLinearTokenAbi,
    erc20Abi,
    mockErc721Address,
} from "@/src/generated";

export function TokenBuyModal() {
    const chainId = useChainId();
    const { writeContract, data: hash } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash,
    });

    const [isOpen, setOpen] = useState(false);
    const [tokenAmount, setTokenAmount] = useState("");
    const account = useAccount();
    const { data: balance } = useBalance(account);

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

    const { data: synthBalance } = useReadContract({
        abi: erc20Abi,
        functionName: "balanceOf",
        address: synthAddrss,
        args: [account.address || "0x"],
        query: {
            refetchInterval: 10000,
        },
    });

    const { data: inputAmount } = useReadContract({
        abi: continuousLinearTokenAbi,
        functionName: "priceForAmount",
        address: synthAddrss,
        args: [parseEther(tokenAmount)],
    });

    const handleOpen = () => setOpen(!isOpen);
    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        writeContract({
            abi: coinmunityAbi,
            address:
                coinmunityAddress[chainId as keyof typeof coinmunityAddress],
            functionName: "buyWithNative",
            args: [nftAddressResolved, parseEther(tokenAmount) || BigInt(0)],
            value: inputAmount,
        });
        setTokenAmount("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <Button onClick={handleOpen}>Buy Token </Button>
            <DialogContent
                hideCloseButton={isConfirming}
                className="max-w-[90%] md:max-w-[700px] bg-black"
            >
                {isConfirming ? (
                    <div className="mx-auto">
                        <LoaderIcon className="animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Mint C-nouns</DialogTitle>
                            <DialogDescription>
                                Purchase C-nouns with ETH
                            </DialogDescription>
                        </DialogHeader>
                        {synthBalance && (
                            <p className="mt-4 ml-2">
                                {`Your balance: ${parseFloat(formatEther(synthBalance)).toPrecision(5)} C-noun`}
                            </p>
                        )}
                        <Input
                            placeholder="Enter amount of C-noun to mint"
                            className="my-6"
                            required
                            onChange={(e) => setTokenAmount(e.target.value)}
                        />

                        {inputAmount && (
                            <p className="ml-2">
                                {`You will spend ${parseFloat(formatEther(inputAmount)).toPrecision(5)} ETH`}
                            </p>
                        )}
                        {balance && (
                            <p className="text-sm text-gray-400 ml-2">
                                Balance: {formatUnits(balance.value, 18)} ETH
                            </p>
                        )}
                        <DialogFooter>
                            <Button type="submit" disabled={!tokenAmount}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
