import { ethers, network, deployments, getNamedAccounts } from "hardhat"
import { TELEPHONE } from "../constants"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { Telephone } from "../typechain-types"

const deployTelephoneAndTelephoneExploiter = async () => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId || 31337
    const isLocalChain = developmentChains.includes(network.name)

    if (isLocalChain) {
        log("deploying telephone contract")
        await deploy("Telephone", {
            from: deployer,
            log: true,
            args: [],
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
        })
        log("deployed telephone successfully..")
    }

    const telephone: Telephone = isLocalChain
        ? await ethers.getContract("Telephone")
        : await ethers.getContractAt("Telephone", TELEPHONE)
    // if is local chain -> use locally deployed
    // otherwise assume that it is goerli chain

    log("deploying telephone exploiter contract")
    await deploy("TelephoneExploiter", {
        from: deployer,
        log: true,
        args: [telephone.address],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    log("deployed telephone exploiter successfully")
}

export default deployTelephoneAndTelephoneExploiter

deployTelephoneAndTelephoneExploiter.tags = ["all", "telephone"]
