import { ethers, network, deployments, getNamedAccounts } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"

const deployFalloutContract = async () => {
    const { deployer } = await getNamedAccounts()
    const { log, deploy } = deployments
    const chainId = network.config.chainId || 31337

    log("deploying fallout contract...")

    const fallout = await deploy("Fallout", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    log("fall out deployed..")
}

export default deployFalloutContract

deployFalloutContract.tags = ["all", "fallout"]
