import { ethers, getNamedAccounts, deployments, network } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"

const deployPrivacy = async () => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId || 31337

    log("deploying privacy contract..")
    const d1 = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["string"], ["cow55#"]))

    const d2 = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(["string"], ["buffalo76@"])
    )
    const d3 = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["string"], ["goat89&"]))

    const data = [d1, d2, d3]

    const privacy = await deploy("Privacy", {
        from: deployer,
        log: true,
        args: [data],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    log("deployed privacy contract..")

    // log("deploying storage Location...")

    // await deploy("PrivacyHack", {
    //     from: deployer,
    //     log: true,
    //     args: [privacy.address],
    //     waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    // })

    // log("deployed storage location...")
}

export default deployPrivacy

deployPrivacy.tags = ["all", "privacy"]
