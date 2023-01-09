import { ethers, network, getNamedAccounts, deployments } from "hardhat"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { GATEKEEPERTWO } from "../constants"
import { GatekeeperTwo } from "../typechain-types"
const deployGateKeeperTwo = async () => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId || 31337
    let keeper2Address = GATEKEEPERTWO
    if (developmentChains.includes(network.name)) {
        log("deploying gate keeper two")

        const keeper2 = deploy("GatekeeperTwo", {
            from: deployer,
            log: true,
            args: [],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })
        keeper2Address = (await keeper2).address

        log("deployment successfull")
    }

    const keeper2Contract: GatekeeperTwo = await ethers.getContractAt(
        "GatekeeperTwo",
        keeper2Address
    )
    console.log("entrant address before exploit...", await keeper2Contract.entrant())

    log("deploying gatekeeper 2 exploit contract")

    const keeper2Exploit = await deploy("GatekeeperTwoExploit", {
        from: deployer,
        log: true,
        args: [keeper2Address],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    console.log("entrant address after exploit...", await keeper2Contract.entrant())
    console.log("...is same as deployer", deployer)
}

export default deployGateKeeperTwo

deployGateKeeperTwo.tags = ["all", "gatekeepertwo"]
