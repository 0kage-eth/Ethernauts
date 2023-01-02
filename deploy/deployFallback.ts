import { ethers, getNamedAccounts, deployments, network } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"

const deployFallBack = async () => {
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId || 31337

    const { deploy, log } = deployments

    log("deploying fallback contract...")

    const deployTx = await deploy("Fallback", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    console.log("deployment successfull..")
}

export default deployFallBack

deployFallBack.tags = ["all", "fallback"]
