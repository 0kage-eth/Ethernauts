import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"
import { developmentChains } from "../helper-hardhat-config"
import { GATEKEEPERONE } from "../constants"

const deployGasKeeperOne = async () => {
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId || 31337
    let gateKeeperAddress = GATEKEEPERONE
    const { deploy, log } = deployments

    if (developmentChains.includes(network.name)) {
        log("deploying GasKeeperOne contract...")

        const gateKeeper = await deploy("GatekeeperOne", {
            from: deployer,
            log: true,
            args: [],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })
        gateKeeperAddress = gateKeeper.address
        console.log("deployment successfull..")
    }

    log("deploying GasKeeper exploit contract")

    const deployExploitTx = await deploy("GateKeeperExploit", {
        from: deployer,
        log: true,
        args: [gateKeeperAddress],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })
}

export default deployGasKeeperOne

deployGasKeeperOne.tags = ["all", "gatekeeperone"]
