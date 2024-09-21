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
                },
                MockERC721: {
                    31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                },
            },
        }),
    ],
});
