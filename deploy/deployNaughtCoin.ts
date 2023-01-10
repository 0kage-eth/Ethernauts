import { ethers, network, deployments, getNamedAccounts } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { NAUGHTCOIN } from "../constants"
const deployNaughtCoin = async () => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainID = network.config.chainId || 31337
    let naughtCoinAddress = NAUGHTCOIN

    if (developmentChains.includes(network.name)) {
        log("deploying naught coin contract...")

        const coin = await deploy("NaughtCoin", {
            from: deployer,
            args: [deployer],
            log: true,
            waitConfirmations: networkConfig[chainID].blockConfirmations || 1,
        })
        naughtCoinAddress = coin.address
        log("contract deployed successfully")
    }

    log("deploying naught coin exploit contract...")
    const coinExploiter = await deploy("NaughtCoinExploit", {
        from: deployer,
        args: [naughtCoinAddress],
        log: true,
        waitConfirmations: networkConfig[chainID].blockConfirmations || 1,
    })
    log("contract deployed successfully")
}

export default deployNaughtCoin

deployNaughtCoin.tags = ["all", "naughtcoin"]
