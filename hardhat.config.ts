import { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "@nomicfoundation/hardhat-chai-matchers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"
import "solidity-coverage"
import "@typechain/hardhat"

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || ""
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || ""
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2 || ""

// this needs to be revisited
const FORKING_BLOCK_NUMBER = process.env.FORKING_BLOCK_NUMBER

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || ""
const boolREPORT_GAS = process.env.REPORT_GAS || false

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            // If you want to do some forking set `enabled` to true
            forking: {
                url: MAINNET_RPC_URL,
                // blockNumber: FORKING_BLOCK_NUMBER, // TO DO
                enabled: false,
            },
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        localhost: {
            saveDeployments: true,
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts:
                PRIVATE_KEY !== undefined
                    ? PRIVATE_KEY2 !== undefined
                        ? [PRIVATE_KEY, PRIVATE_KEY2]
                        : [PRIVATE_KEY]
                    : [],
            //accounts: {
            //     mnemonic: MNEMONIC,
            // },
            saveDeployments: true,
            chainId: 5,
            gas: 6000000,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            //   accounts: {
            //     mnemonic: MNEMONIC,
            //   },
            saveDeployments: true,
            chainId: 4,
            gas: 6000000,
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            //   accounts: {
            //     mnemonic: MNEMONIC,
            //   },
            saveDeployments: true,
            chainId: 1,
        },
        polygon: {
            url: POLYGON_MAINNET_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            saveDeployments: true,
            chainId: 137,
        },
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY,
            goerli: ETHERSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY,
        },
        customChains: [],
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },

    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        user1: {
            default: 1,
        },
        user2: {
            default: 2,
        },
        user3: {
            default: 3,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.17",
            },
            {
                version: "0.6.0",
            },
            {
                version: "0.6.12",
            },
        ],
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}

export default config
