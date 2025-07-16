import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

dotenv.config();

const { PRIVATE_KEY, RPC_URL, CHAIN_ID, ETHERSCAN_KEY } = process.env;

console.log({ PRIVATE_KEY, RPC_URL, CHAIN_ID, ETHERSCAN_KEY });

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    networks: {
        sepolia: {
            url: RPC_URL as string,
            accounts: [PRIVATE_KEY as string],
            chainId: Number(CHAIN_ID),
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_KEY ?? "",
    },
    sourcify: {
        enabled: true,
    },
};

export default config;
