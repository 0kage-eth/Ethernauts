//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

contract MagicNum {
    address public solver;

    constructor() {}

    function setSolver(address _solver) public {
        solver = _solver;
    }

    /*
    ____________/\\\_______/\\\\\\\\\_____        
     __________/\\\\\_____/\\\///////\\\___       
      ________/\\\/\\\____\///______\//\\\__      
       ______/\\\/\/\\\______________/\\\/___     
        ____/\\\/__\/\\\___________/\\\//_____    
         __/\\\\\\\\\\\\\\\\_____/\\\//________   
          _\///////////\\\//____/\\\/___________  
           ___________\/\\\_____/\\\\\\\\\\\\\\\_ 
            ___________\///_____\///////////////__
  */
}

// BYTE Code

// -n Runtime Code
// -n regardless of the function called, we have to return the number 42
// -n first we store number 42 in memory, second we return the memory location

//-n here is opcodes for storing 42 to memory

/*
PUSH1 0x2a //-n pushes 42 to stack
PUSH1 0 //-n pushes memory location starting 0
MSTORE //-n stores 42 at memory location 0 (note that memory location is 32 bytes)
*/

//-n here is opcodes for returning variable in memory

/*
PUSH1 0x20 //-n length - 32 bytes
PUSH1 0 //-n at location 0
RETURN
*/

//-n combining the above sequency of opcodes we get a byte code - returns 42 always
//-n 602a60005260206000f3

//-n next step is to write creation code
//-n creation code in our case creates a contract that returns 42 regardless of what function being called
//-n so basically creation code stores runtime to memory
//-n here is sequence of opcodes

/*
PUSH10 0x602a60005260206000f3 //-n length = 20, so bytes = 10 // putting 0x to make it clear its not a number but a byte code
PUSH1 0
MSTORE

//-n this returns the 32 bytes -> what we need is the last 10 bytes, so we need to offset the value and return only 10 bytes

PUSH1 0x0a //-n 10 - 10 bytes
PUSH1 0x16 //-n 22 - start position 22 bytes
RETURN
*/

//-n translating above 2 series of opcodes into bytecode
//-n 69602a60005260206000f3600052600a6016f3

contract Solver {
    constructor(MagicNum _target) {
        address addr;
        //-n this bytecode is for creation of
        bytes memory bytecode = hex"69602a60005260206000f3600052600a6016f3";
        assembly {
            addr := create(0, add(bytecode, 0x20), 0x13) //-n we offset bytecode bytes array by 32 bytes
            //-n because first 32 bytes have the size of the array
            //-n 0x13 refers to 19 bytes -> 38 characters (which is length of bytecode above)
        }
        require(addr != address(0), "zero address");

        //-n runtime code 0x602a60005260206000f3 has less than 10 opcodes
        _target.setSolver(addr);
    }
}
