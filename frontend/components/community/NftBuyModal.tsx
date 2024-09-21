import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import Image from "next/image";
import {
    useAccount,
    useChainId,
    useReadContract,
    useReadContracts,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import {
    coinmunityAbi,
    coinmunityAddress,
    mockErc721Abi,
    mockErc721Address,
} from "@/src/generated";

export function NftBuyModal() {
    const chainId = useChainId();
    const account = useAccount();
    const { writeContract, data: hash } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash,
    });
    const [isOpen, setOpen] = useState(false);
    const [selectedNft, setSelectedNft] = useState<number>();

    const nftAddressResolved =
        mockErc721Address[chainId as keyof typeof mockErc721Address];
    const coinmunityAddressResolved =
        coinmunityAddress[chainId as keyof typeof coinmunityAddress];

    const { data: tokenBalance, refetch } = useReadContract({
        abi: mockErc721Abi,
        functionName: "balanceOf",
        address: nftAddressResolved,
        args: [account.address || "0x"],
        query: { refetchInterval: 10000 },
    });

    const { data: tokensInfoArray } = useReadContracts({
        contracts: Array.from(
            Array(Number(tokenBalance || BigInt(0))).keys()
        ).map((id) => ({
            abi: mockErc721Abi,
            functionName: "tokenOfOwnerByIndex",
            address: nftAddressResolved,
            args: [account.address || "0x", id],
        })),
    });

    const { data: isApproved } = useReadContract({
        abi: mockErc721Abi,
        functionName: "isApprovedForAll",
        address: nftAddressResolved,
        args: [account.address || "0x", coinmunityAddressResolved],
        query: { refetchInterval: 10000 },
    });

    const buyWithNFT = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!isApproved) {
            writeContract({
                abi: mockErc721Abi,
                functionName: "setApprovalForAll",
                address: nftAddressResolved,
                args: [coinmunityAddressResolved, true],
            });
            return;
        }
        writeContract({
            abi: coinmunityAbi,
            address: coinmunityAddressResolved,
            functionName: "buyWithNFT",
            args: [nftAddressResolved, BigInt(selectedNft || 0)],
        });
    };

    const handleOpen = () => setOpen(!isOpen);

    useEffect(() => {
        setSelectedNft(Number(tokensInfoArray?.[0]?.result));
    }, [tokensInfoArray]);

    useEffect(() => {
        refetch();
    }, [isConfirming, refetch]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <Button onClick={handleOpen}>Buy With NFT </Button>
            <DialogContent
                hideCloseButton={isConfirming}
                className="max-w-[90%] md:max-w-[700px] bg-black"
            >
                {isConfirming ? (
                    <div className="mx-auto">
                        <LoaderIcon className="animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={buyWithNFT}>
                        <DialogHeader>
                            <DialogTitle>Mint C-nouns</DialogTitle>
                            <DialogDescription>
                                Your Noun (ERC721) will be converted to a C-noun
                                (ERC20)
                            </DialogDescription>
                        </DialogHeader>
                        {tokensInfoArray ? (
                            <RadioGroup
                                defaultValue="1"
                                className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6"
                            >
                                {tokensInfoArray.map((res) => {
                                    const id = Number(res.result);
                                    return (
                                        <div
                                            key={id}
                                            onClick={() => setSelectedNft(id)}
                                        >
                                            <RadioGroupItem
                                                value={id.toString()}
                                                id={id.toString()}
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor={id.toString()}
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary gap-4 cursor-pointer"
                                            >
                                                <Image
                                                    src={`https://noun.pics/${id}`}
                                                    className="rounded w-24 h-24"
                                                    alt={`noun-${id}`}
                                                    width={96}
                                                    height={96}
                                                />
                                                Noun {id}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </RadioGroup>
                        ) : (
                            <p className="text-center my-8">
                                You do not own any Nouns
                            </p>
                        )}
                        <DialogFooter>
                            <Button type="submit" disabled={!selectedNft}>
                                {isApproved ? "Confirm" : "Approve"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
