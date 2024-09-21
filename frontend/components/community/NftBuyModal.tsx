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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import Image from "next/image";

export function NftBuyModal() {
    const [ownedNfts, setOwnedNfts] = useState([1, 2, 3]);
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [selectedNft, setSelectedNft] = useState<number>();

    const handleOpen = () => setOpen(!isOpen);
    const handleSubmit = (e) => {};

    return (
        <Dialog open={isOpen} onOpenChange={handleOpen}>
            <Button onClick={handleOpen}>Buy With NFT </Button>
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
                                Your Noun (ERC721) will be converted to a C-noun
                                (ERC20)
                            </DialogDescription>
                        </DialogHeader>
                        {ownedNfts ? (
                            <RadioGroup
                                defaultValue="1"
                                className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6"
                            >
                                {ownedNfts.map((id) => (
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
                                                src={`https://noun.pics/${0}`}
                                                className="rounded w-24 h-24"
                                                alt={`noun-${id}`}
                                                width={96}
                                                height={96}
                                            />
                                            {id}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        ) : (
                            <p className="text-center my-8">
                                You do not own any Nouns
                            </p>
                        )}
                        <DialogFooter>
                            <Button type="submit" disabled={!selectedNft}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
