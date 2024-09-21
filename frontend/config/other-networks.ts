import { CaipNetwork } from "@reown/appkit";

export const rskTestnet: CaipNetwork = {
    id: "eip155:31",
    chainId: 31,
    chainNamespace: "eip155",
    name: "Rootstock Testnet",
    currency: "RBTC",
    explorerUrl: "https://explorer.testnet.rsk.co/",
    rpcUrl: "https://public-node.testnet.rsk.co",
};
export const flowTestnet: CaipNetwork = {
    id: "eip155:545",
    chainId: 545,
    chainNamespace: "eip155",
    name: "Flow Testnet",
    currency: "FLOW",
    explorerUrl: "https://testnet.flowdiver.io/",
    rpcUrl: "https://testnet.evm.nodes.onflow.org",
};
export const airDaoTestnet: CaipNetwork = {
    id: "eip155:22040",
    chainId: 22040,
    chainNamespace: "eip155",
    name: "AirDAO Testnet",
    currency: "AMB",
    explorerUrl: "https://airdao.io/explorer/",
    rpcUrl: "https://network.ambrosus-test.io",
};
export const lineaSepolia: CaipNetwork = {
    id: "eip155:59141",
    chainId: 59141,
    chainNamespace: "eip155",
    name: "Linea Testnet",
    currency: "ETH",
    explorerUrl: "https://explorer.linea.network/",
    rpcUrl: "https://rpc.sepolia.linea.build",
};
