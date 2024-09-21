import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia } from "@reown/appkit/networks";
import {
    airDaoTestnet,
    flowTestnet,
    lineaSepolia,
    rskTestnet,
    hardhat,
} from "./other-networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
    throw new Error("Project ID is not defined");
}

export const networks = [
    sepolia,
    rskTestnet,
    flowTestnet,
    airDaoTestnet,
    lineaSepolia,
    hardhat,
];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks,
});

export const config = wagmiAdapter.wagmiConfig;
