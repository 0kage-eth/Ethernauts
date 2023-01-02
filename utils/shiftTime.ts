import { mine, time } from "@nomicfoundation/hardhat-network-helpers"
import { BigNumber } from "ethers"
/**
 * @notice increases time and moves ahead by 1 block - only to be done on local chain
 * @param timeShift time increase in seconds
 */
export const shiftTime = async (timeShift: number) => {
    // increase time by timeShift seconds
    await time.increase(timeShift)

    // mine single block
    await mine(1)
}

export const shiftTimeWithoutMiningBlock = async (timeShift: number) => {
    // just increases time without mining a block like above
    await time.increase(timeShift)
}

/**
 * @notice shifts time to a specific snapshot. Note snapshot always should be in future
 * @param snapshot snapshot to which blockchain time shifts. Time here is absolute time
 */
export const shiftTimeTo = async (snapshot: number | BigNumber) => {
    // increase time by timeShift seconds
    await time.increaseTo(snapshot)

    // mine single block
    await mine(1)
}

export const shiftTimeToWithoutMiningBlock = async (snapshot: number | BigNumber) => {
    // increase time by timeShift seconds
    await time.increaseTo(snapshot)
}
