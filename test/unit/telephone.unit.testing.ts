import { deployments, ethers, network } from "hardhat"
import { assert, expect } from "chai"
import { developmentChains } from "../../helper-hardhat-config"
import { Telephone, TelephoneExploiter } from "../../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Telephone Exploit Testing", () => {
          let telephone: Telephone
          let telephoneExploiter: TelephoneExploiter
          let deployer: SignerWithAddress, exploiter: SignerWithAddress

          before(async () => {})

          it("telephone exploit", async () => {
              await deployments.fixture("telephone")
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              exploiter = accounts[1]

              telephone = await ethers.getContract("Telephone", deployer.address)
              telephoneExploiter = await ethers.getContract("TelephoneExploiter", exploiter.address)

              expect(await telephone.owner()).equals(
                  deployer.address,
                  "deployer == telephone owner"
              )

              const exploitTx = await telephoneExploiter.changeTelephoneOwner()
              await exploitTx.wait(1)

              expect(await telephone.owner()).equals(
                  exploiter.address,
                  "exploiter == telephone owner"
              )
          })
      })
