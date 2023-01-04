import { ethers, deployments, getNamedAccounts, network } from "hardhat"
import { assert, expect } from "chai"
import { developmentChains } from "../../helper-hardhat-config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Force, ForceExploiter } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Force Exploit", () => {
          let deployer: SignerWithAddress, exploiter: SignerWithAddress
          let force: Force
          let forceExploiter: ForceExploiter

          before(async () => {
              const accounts = await ethers.getSigners()

              deployer = accounts[0]
              exploiter = accounts[1]
              await deployments.fixture(["force"])

              force = await ethers.getContract("Force", deployer)
              forceExploiter = await ethers.getContract("ForceExploiter", deployer)
          })

          it("Force Exploit Testing", async () => {
              const attactTx = await forceExploiter.attack(force.address)

              expect(await ethers.provider.getBalance(force.address)).equals(
                  ethers.utils.parseEther("1"),
                  "force balance == 1 ether"
              )
          })
      })
