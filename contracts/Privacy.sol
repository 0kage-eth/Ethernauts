// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

// Challenge - > crack the lock and make it false
contract Privacy {
    bool public locked = true;
    uint256 public ID = block.timestamp;
    uint8 private flattening = 10;
    uint8 private denomination = 255;
    uint16 private awkwardness = uint16(block.timestamp);
    bytes32[3] private data;

    constructor(bytes32[3] memory _data) {
        data = _data;
    }

    function unlock(bytes16 _key) public {
        // console.log("inside unlock");
        // console.logBytes(abi.encode(_key));
        // console.logBytes(abi.encode(bytes16(data[2])));
        require(_key == bytes16(data[2]));
        locked = false;
    }

    /*
    A bunch of super advanced solidity algorithms...

      ,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`
      .,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,
      *.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^         ,---/V\
      `*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.    ~|__(o.o)
      ^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'^`*.,*'  UU  UU
  */
}

// contract PrivacyHack {
//     Privacy private immutable privacy;

//     constructor(address _privacy) {
//         privacy = Privacy(_privacy);
//     }

//     function getArrayStorage(uint256 storageIndex) private pure returns (bytes32) {
//         return keccak256(abi.encode(storageIndex));
//     }

//     function getArrayItemStorage(
//         uint256 arrayStorageIndex,
//         uint256 arrayItemIndex
//     ) private pure returns (bytes32) {
//         bytes32 arrayStorage = getArrayStorage(arrayStorageIndex);

//         return bytes32(uint256(arrayStorage) + arrayItemIndex);
//     }

//     function unlock() external {
//         // get the bytes32 stored in arrayStorageIndex 3 and arrayItemIndex 2

//         bytes32 element = get(3, 2);

//         console.logBytes(abi.encodePacked(element));
//         // convert bytes32 into bytes16
//         // bytes16 key = bytes16(element);

//         // privacy.unlock(key);
//     }
// }
