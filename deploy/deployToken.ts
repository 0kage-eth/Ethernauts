import { ethers, deployments, network } from "hardhat"
import { DeployResult } from "hardhat-deploy/dist/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { Token } from "../typechain-types"

const deployToken = async () => {
    const { log, deploy } = deployments
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const exploiter = accounts[1]
    const chainId = network.config.chainId || 31337

    log("deploying token contract...")

    await deploy("Token", {
        from: deployer.address,
        log: true,
        args: [ethers.utils.parseEther("21")],
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })

    const tokenContract: Token = await ethers.getContract("Token", deployer)

    const transferTx = await tokenContract.transfer(exploiter.address, ethers.utils.parseEther("1")) // transfering 1 ether to Exploiter on deployment
    await transferTx.wait(1)

    log("token contract deployed")
    log("1 ether value transfered to exploiter account as initial balance")
}

export default deployToken

deployToken.tags = ["all", "token"]
