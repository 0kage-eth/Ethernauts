import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"
import { developmentChains } from "../helper-hardhat-config"
import { MAGICNUMBER } from "../constants"

const deploySolver = async () => {
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId || 31337

    const { deploy, log } = deployments

    if (!developmentChains.includes(network.name)) {
        log("deploying solver contract...")

        //-n deploys solver contract
        //-n solver contract calls the MagicNumber setSolver to set the address
        const deployTx = await deploy("Solver", {
            from: deployer,
            log: true,
            args: [MAGICNUMBER],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })

        console.log("deployment successfull..")
    }
}

export default deploySolver

deploySolver.tags = ["all", "magicnumber"]
