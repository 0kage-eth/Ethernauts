import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { GatekeeperOne, GateKeeperExploit } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("GateKeeperOne Exploit Testing", () => {
          let gatekeeper: GatekeeperOne
          let gatekeeperExploit: GateKeeperExploit
          let exploiter: SignerWithAddress
          // run before test cases
          before(async () => {
              await deployments.fixture(["gatekeeperone"])
              gatekeeper = await ethers.getContract("GatekeeperOne")
              gatekeeperExploit = await ethers.getContract("GateKeeperExploit")
              const accounts = await ethers.getSigners()
              exploiter = accounts[0]
          })

          it("gatekeeperone exploit", async () => {
              // Uncomment below to brute force the gas to clear step 2
              // I did that and found gas price 82725

              //              let gas = 82725
              //   for (let i = 0; i <= 8191; i++) {
              //       gas = 8191 * 10 + i
              //       try {
              const tx = await gatekeeperExploit.connect(exploiter).hack()
              const receipt = await tx.wait(1)
              //           break
              //       } catch (e) {}
              //   }

              //   console.log("target gas price", gas)
              expect(await gatekeeper.entrant()).equals(exploiter.address, "entrant = exploiter")
          })
      })
