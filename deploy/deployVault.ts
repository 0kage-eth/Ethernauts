import { ethers, getNamedAccounts, deployments, network } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"

const deployVault = async () => {
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId || 31337

    const { deploy, log } = deployments

    log("deploying vault contract...")

    const passwordHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(["string"], ["tesseract77#"])
    )

    const deployTx = await deploy("Vault", {
        from: deployer,
        log: true,
        args: [passwordHash],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    console.log("deployment successfull..")
}

export default deployVault

deployVault.tags = ["all", "vault"]
