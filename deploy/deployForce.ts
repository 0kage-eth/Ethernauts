import { ethers, network, deployments, getNamedAccounts } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
// deploy force and force exploit
const deployForce = async () => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId || 31337
    const isLocalChain = developmentChains.includes(network.name)
    const initialAmt = isLocalChain
        ? ethers.utils.parseEther("1")
        : ethers.utils.parseEther("0.000001")

    if (isLocalChain) {
        log("deploying Force contract...")

        await deploy("Force", {
            from: deployer,
            log: true,
            args: [],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })

        log("Force deployed successfully..")
    }

    log("deploying Force Exploiter")
    await deploy("ForceExploiter", {
        from: deployer,
        log: true,
        value: initialAmt, // send 1 ether if local, 0.000001 ether if goerli
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })
    log("Force exploiter deployed successfully..")
}

export default deployForce

deployForce.tags = ["all", "force"]
