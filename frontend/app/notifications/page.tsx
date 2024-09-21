"use client";
import { Navbar } from "@/components/navbar";
// Index.tsx
import Notifications from "@/components/notifications/Notifications";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    initWeb3InboxClient,
    // useNotifications,
    usePrepareRegistration,
    useRegister,
    useSubscribe,
    useSubscription,
    useUnsubscribe,
    useWeb3InboxAccount,
    useWeb3InboxClient,
} from "@web3inbox/react";
import { useSignMessage, useAccount } from "wagmi";

export default function App() {
    // Wagmi Hooks
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();

    // W3I Hooks
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN!;
    const notifyKey = process.env.NOTIFY_API_KEY!;
    fetch(`https://notify.walletconnect.com/${projectId}/notify`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${notifyKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            notification: {
                type: "651cc992-3b18-4314-8e5e-dd1009035d4f",
                title: "Discord Server",
                body: "Join https://discord.com/invite/nouns to stay updated!",
                url: "https://discord.com/invite/nouns",
            },
            accounts: [
                "eip155:11155111:0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb",
                "eip155:31:0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb",
                "eip155:545:0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb",
                "eip155:59141:0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb",
                "eip155:22040:0x1e527408BFC6Fcaf91a7Fb0c80D11F57E8f171Cb",
            ],
        }),
    });

    initWeb3InboxClient({
        projectId,
        domain: appDomain,
        allApps: process.env.NODE_ENV !== "production",
    });
    const { prepareRegistration } = usePrepareRegistration();
    const { register } = useRegister();
    const { data: w3iClient, isLoading: w3iClientIsLoading } =
        useWeb3InboxClient();
    const { isRegistered } = useWeb3InboxAccount(`eip155:1:${address}`);
    console.log(w3iClient);

    // Registration of your address to allow notifications
    // This is done via a signature of a message (SIWE) and the
    // signMessageAsync function from wagmi
    const handleRegistration = async () => {
        try {
            const { message, registerParams } = await prepareRegistration();
            const signature = await signMessageAsync({ message: message });
            await register({ registerParams, signature });
        } catch (registerIdentityError: unknown) {
            console.error(registerIdentityError);
        }
    };

    // Subscription to dapp notifications
    // Subscribe can be called as a function post registration
    // Can be moved above but shown for example clarity
    const { subscribe, isLoading: isSubscribing } = useSubscribe();
    const { unsubscribe, isLoading: isUnsubscribing } = useUnsubscribe();
    const { data: subscription } = useSubscription();
    const isSubscribed = Boolean(subscription);

    const NOTIFY_API_SECRET = "<NOTIFY_API_SECRET>";
    // Note: We are using AppKit for the dapp <> wallet connection.
    // The <w3m-button /> module is from AppKit. Check AppKit Docs for further info.
    return (
        <main className="min-h-screen px-8 py-0 pb-12 flex-1 flex flex-col items-center">
            <Navbar />
            <main>
                {w3iClientIsLoading ? (
                    <div>Loading Client</div>
                ) : (
                    <Card className="w-full max-w-[1080px]">
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                Set up your notifications for the community
                                here!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-col gap-y-8 p-4">
                            <div className="flex gap-2 mb-8">
                                <Button
                                    onClick={handleRegistration}
                                    disabled={isRegistered}
                                    className="border "
                                    variant={"default"}
                                >
                                    {isRegistered ? "Registered" : "Register"}
                                </Button>
                                <Button
                                    onClick={
                                        isSubscribed
                                            ? () => unsubscribe()
                                            : () => subscribe()
                                    }
                                    disabled={isSubscribing || isUnsubscribing}
                                    variant={"secondary"}
                                >
                                    {isSubscribed ? "Unsubscribe" : "Subscribe"}
                                </Button>
                            </div>
                            {isSubscribed ? <Notifications /> : null}
                        </CardContent>
                    </Card>
                )}
            </main>
        </main>
    );
}
