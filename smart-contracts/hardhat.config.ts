import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",  // Updated from 0.8.19
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        xlayer: {
            url: process.env.XLAYER_RPC_URL || "https://rpc.xlayer.tech",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 196,
        },
        hardhat: {
            chainId: 1337,
        },
    },
};

export default config;