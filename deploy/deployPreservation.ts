import { ethers, deployments, network, getNamedAccounts } from "hardhat"
import { developmentChains, networkConfig } from "../helper-hardhat-config"

const deployOnGoerli = true

const deployPreservation = async () => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const isDevChain = developmentChains.includes(network.name)
    const chainId = (await network.config.chainId) || 31337
    if (!isDevChain && deployOnGoerli) {
        log("deploying ExploitLibrary contract")

        const exploit = await deploy("ExploitLibraryContract", {
            from: deployer,
            log: true,
            args: [],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })

        log("Exploit Library contract successfully deployed")
    }

    if (isDevChain) {
        log("deploying Library Contract 1")

        const lib1 = await deploy("LibraryContract", {
            from: deployer,
            log: true,
            args: [],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })

        log("Library contract 1 successfully deployed")

        log("deploying Library Contract 2")

        const lib2 = await deploy("LibraryContract", {
            from: deployer,
            log: true,
            args: [],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })

        log("Library contract 2 successfully deployed")

        log("deploying Preservation contract")

        const pv = await deploy("Preservation", {
            from: deployer,
            log: true,
            args: [lib1.address, lib2.address],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })

        log("Preservation successfully deployed")

        log("deploying ExploitLibrary contract")

        const exploit = await deploy("ExploitLibraryContract", {
            from: deployer,
            log: true,
            args: [],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })

        log("Exploit Library contract successfully deployed")
    }
}

export default deployPreservation

deployPreservation.tags = ["all", "preservation"]
