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
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

export function TokenBuyModal() {
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [ethAmount, setEthAmount] = useState("");
    const account = useAccount();
    const { data: balance } = useBalance(account);

    const handleOpen = () => setOpen(!isOpen);
    const handleSubmit = (e) => {};

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <Button onClick={handleOpen}>Buy Token </Button>
            <DialogContent
                hideCloseButton={isLoading}
                className="max-w-[90%] md:max-w-[700px] bg-black"
            >
                {isLoading ? (
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
                        <Input
                            placeholder="Enter amount"
                            className="mt-6"
                            required
                            onChange={(e) => setEthAmount(e.target.value)}
                        />
                        {balance && (
                            <p className="text-sm text-gray-400 ml-2">
                                Balance: {formatUnits(balance.value, 18)} ETH
                            </p>
                        )}

                        <p className="ml-2 mt-4">
                            You will receive 2370137 C-nouns
                        </p>
                        <DialogFooter>
                            <Button type="submit" disabled={!ethAmount}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
