import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";
import path from "path";

export default defineConfig({
    out: "src/generated.ts",
    contracts: [],
    plugins: [
        hardhat({
            project: path.resolve(__dirname, "../contracts"),
            deployments: {
                Coinmunity: {
                    31337: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                    22040: "0x8ab1c3e845D2c96E9e032EEF798cD3bc551F1E8a", // airdao
                    31: "0x892ae2d81777B4D2Ae82Ca150E7f56f5D392B259", // rsk
                    11155111: "0xF4A48a6DbCfC9547A1661cF8B5762d2A7451AeE5", // sepolia
                },
                MockERC721: {
                    31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                    22040: "0xabdf605A52b372c6aC2c63399E0D5A3A481fb869",
                    31: "0xBc59fb0E44F80C13f5988F0d57b2b866a74913Cb",
                    11155111: "0x6d601b3a60Ec0a08e61dC7084C7EDAa457E77476",
                },
            },
        }),
    ],
});
