import { ethers, getNamedAccounts, deployments, network } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { ELEVATOR } from "../constants"
const deployElevator = async () => {
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId || 31337
    let elevatorAddress = ELEVATOR
    const { deploy, log } = deployments

    if (developmentChains.includes(network.name)) {
        log("deploying elevator contract...")

        const deployTx = await deploy("Elevator", {
            from: deployer,
            log: true,
            args: [],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })
        elevatorAddress = deployTx.address
        log("deployed elevator successfully..")
    }

    log("deploying elevator exploit...")

    const deployTx2 = await deploy("ElevatorExploit", {
        from: deployer,
        log: true,
        args: [elevatorAddress],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    log("elevator exploit deployed successfully...")
}

export default deployElevator

deployElevator.tags = ["all", "elevator"]
