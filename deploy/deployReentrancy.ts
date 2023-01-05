import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"
import { developmentChains } from "../helper-hardhat-config"
import { REENTRANT } from "../constants"

const deployReentrancy = async () => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId || 31337

    const { deploy, log } = deployments
    let reentrantAddress = REENTRANT
    const isLocalChain = developmentChains.includes(network.name)
    if (isLocalChain) {
        log("deploying reentrancy contract...")

        const deployTx = await deploy("Reentrance", {
            from: deployer,
            log: true,
            args: [],
            value: ethers.utils.parseEther("0.001"),
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })

        console.log("deployment successfull..")
        reentrantAddress = deployTx.address
    }

    log("deploying reentrancy exploit contract")
    console.log("reentrancy address", reentrantAddress)
    const deployReentrancyExploit = await deploy("ReentrancyExploiter", {
        from: deployer,
        log: true,
        args: [reentrantAddress],
        value: ethers.utils.parseEther("0.001"),
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })
    console.log("deployment successfull..")
}

export default deployReentrancy

deployReentrancy.tags = ["all", "reentrancy"]
