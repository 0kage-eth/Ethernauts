import { ethers, network, deployments, getNamedAccounts } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { RECOVERY } from "../constants"

const deployRecovery = async () => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainID = network.config.chainId || 31337
    let recoveryAddress = RECOVERY

    if (developmentChains.includes(network.name)) {
        log("deploying recovery contract...")

        const contract = await deploy("Recovery", {
            from: deployer,
            args: [],
            log: true,
            value: ethers.utils.parseEther("0.01"),
            waitConfirmations: networkConfig[chainID].blockConfirmations || 1,
        })
        recoveryAddress = contract.address
        log("recovery deployed successfully")
    }
    log("deploying recovery exploit contract...")
    const recoveryExploit = await deploy("RecoveryExploit", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: networkConfig[chainID].blockConfirmations || 1,
    })
    log("recovery exploit deployed successfully")
}

export default deployRecovery

deployRecovery.tags = ["all", "recovery"]
