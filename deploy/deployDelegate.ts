import { ethers, deployments, getNamedAccounts, network } from "hardhat"
import { DeployResult } from "hardhat-deploy/dist/types"
import { networkConfig } from "../helper-hardhat-config"

const deployDelegates = async () => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId || 31337

    log("deploying Delegate contract")

    const delegate: DeployResult = await deploy("Delegate", {
        from: deployer,
        args: [deployer],
        log: true,
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    log("deployed Delegate..")

    log("deploying delegation contract")

    await deploy("Delegation", {
        from: deployer,
        args: [delegate.address],
        log: true,
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    log("deployed Delegation..")
}

export default deployDelegates

deployDelegates.tags = ["all", "delegate"]
