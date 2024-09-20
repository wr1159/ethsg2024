import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";
import path from "path";

export default defineConfig({
    out: "src/generated.ts",
    contracts: [],
    plugins: [
        hardhat({
            project: path.resolve(__dirname, "../contracts"),
            deployments: {},
        }),
    ],
});
