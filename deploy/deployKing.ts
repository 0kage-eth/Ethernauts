import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"
import { developmentChains } from "../helper-hardhat-config"
const deployKing = async () => {
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId || 31337

    const { deploy, log } = deployments

    if (developmentChains.includes(network.name)) {
        log("deploying king contract...")

        const deployTx = await deploy("King", {
            from: deployer,
            log: true,
            args: [],
            value: ethers.utils.parseEther("0.0001"),
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })

        console.log("deployment successfull..")
    }

    log("deploying king exploit contract")

    const deployExploitTx = await deploy("KingExploit", {
        from: deployer,
        log: true,
        value: ethers.utils.parseEther("0.0011"),
        args: [],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })
}

export default deployKing

deployKing.tags = ["all", "king"]
