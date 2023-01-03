import { ethers, network, deployments, getNamedAccounts } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"

const deployCoinflip = async () => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainID = network.config.chainId || 31337

    log("deploying coinflip contract...")

    const deployTx = await deploy("CoinFlip", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: networkConfig[chainID].blockConfirmations || 1,
    })

    console.log("contract deployed successfully")
}

export default deployCoinflip

deployCoinflip.tags = ["all", "coinflip"]
