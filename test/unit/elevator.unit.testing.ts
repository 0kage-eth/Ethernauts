import { assert, expect } from "chai"
import { ethers, network, deployments } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Elevator, ElevatorExploit } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Elevator Exploit Testing", () => {
          let elevator: Elevator
          let elevatorExploit: ElevatorExploit

          before(async () => {
              await deployments.fixture(["elevator"])
              elevator = await ethers.getContract("Elevator")
              elevatorExploit = await ethers.getContract("ElevatorExploit")
          })

          it("elevator exploit", async () => {
              await (await elevatorExploit.changeFloor(0)).wait(1)
              expect(await elevator.top(), "top == true")
          })
      })
