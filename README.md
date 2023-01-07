# Ethernauts challenges


## Challenge 1 - Fallback

### Challenge
Challenge is to change owner and drain contract

### Vulnerability
In fallback challenge, we need to change the owner and drain the funds. Key here is to realize that the `receive` fallback function changes the owner of the contract ->  conditions to be met to change owner are 
- `msg.value` > 0
- `contributions[msg.sender]`>0 -> this can be ensured by calling `contribute` function with a very small amount of eth

Once both above conditions are true, owner of contract can be changed. Once owner is changed, its trivial to call `withdraw` to drain all funds from pool. 


### Files
[Fallback.sol](./contracts/Fallback.sol)
[exploit script](./scripts/fallbackExploit.ts)
[test case](./test/unit/fallback.unit.testing.ts)

### Key learning
Be extra careful when changing owners of contract -> always ask

 - who is allowed to access this function
 - is there a way to accidentally or maliciously change ownership
 - what are the implications of a changed ownership

---

## Challenge 2 - Fallout

### Challenge
Challenge is to change owner and drain contract

### Vulnerability

(This vulnerability is no longer relevant since `constructor` definition has changed now)


In versions earlier 0.8.0, `constructor` was not used to initialize a contract. Instead a function with contract name was used to initialize. In this contract, key vulnerability stems from

- A function that looks like a constructor but isn't (a small spelling error that can go unnoticed)
- This function sets the `owner` and is of public visibility

### Files
[Fallout.sol](./contracts/Fallout.sol)
[exploit script](./scripts/falloutExploit.ts)
[test case](./test/unit/fallout.unit.testing.ts)

### Key learning
Be extra careful when changing owners of contract -> always ask

 - who is allowed to access this function - public/ private / internal  & modifiers that control the access
 - is there a way to accidentally or maliciously change ownership
 - what are the implications of a changed ownership (if a owner can drain funds, stakes of ownership are extremely high)

---

## Challenge 3 - CoinFlip

### Challenge
Rig a coinflip to get 10 consecutive wins

### Vulnerability

Vulnerability here is the way random number is generated inside `flip` function is defined in [CoinFlip.sol](./contracts/CoinFlip.sol). To generate a random number, function uses the current block hash -> this knowledge allows us to replicate a random number and play only if the result is favorable for us. This way, we can keep playing until we generate 10 consecutive wins

### Files
[CoinFlip.sol](./contracts/CoinFlip.sol)
[exploit script](./scripts/coinflipExploit.ts)
[test case](./test/unit/coinflip.uint.testing.ts)

### Key learning
If a protocol is using a random number, study carefully how that randomness is generated - if some deterministic parameters are used for generating random number, it is not really random & can be exploited. 

---

## Challenge 4 - Telephone

### Challenge
Change the owner in the contract

### Vulnerability

Vulnerability exploits general misconception that `tx.origin == msg.sender`. `tx.origin` refers to the original EOA that initiated the first transaction in the chain of transactions whereas `msg.sender`refers to the immediate contract that has triggered a specific transaction.

In this exercise, I defined a `router` contract that inessence changes msg.sender viz-a-viz tx.origin. Any logic written with an implicit assumption that transaction sender is EOA can be violated by this router contract

### Files
[TelephoneExploiter.sol](./contracts/Telephone.sol)
[exploit script](./scripts/telephoneExploit.ts)
[test case](./test/unit/telephone.uint.testing.ts)

### Key learning
Understanding the difference between `msg.sender` and `tx.origin`. Look for instances where `tx.origin` is used - and think of ways in which this can be exploited. Since composability is the name of game - there is likely a way to exploit a contract using `tx.origin` - should generally be avoided 

---

## Challenge 5 - Token

### Challenge
End up with a very large balance in your account

### Vulnerability

Vulnerability exploits arithmetic overflow/underflow operations in solidity - if a balance in account A is `100` and you subtract `101` from it - if unchecked for SafeMath, balance in account A becomes `max(uint256)` - In versions preceding 0.8.0, Solidity compiler does not throw an error if there is underflow/overflow. Instead the value is rolled over to highest value if there is underflow & to the lowest value if there is overflow.

Key here is to transfer to an external account an amount that is higher than existing balance. This automatically increases our balance to near infinity


### Files
[token.sol](./contracts/Token.sol)
[exploit script](./scripts/tokenExploit.ts)
[test case](./test/unit/token.uint.testing.ts)

### Key learning
If `unchecked` math is used in versions >0.8.0, always explore possibility of overflow/underflow. If it exists, then figure out vulnerabilities associated with an infinitely large number or 0 (when there is an underflow or overflow respectively)


---

## Challenge 6 - Delegate

### Challenge
Change the `owner` of `Delegation` contract

### Vulnerability

This challenge tests our understanding of `delegateCall` in solidity - `delegateCall` calls a function in sendee contract with the same context as sender contract. So although the contract logic is being executed from `sendee` contract, contract state is present in the sender contract.

In this example, the `Delegate` contract has a provision to change the owner by calling `pwn()` function - but changing the owner here means we are actually changing the `owner` state variable inside the Delegation contract.

Another interesting technique here is how we send a encoded txn via `ethers.js`. To trigger a `fallback` function inside a `Delegation` contract, we use `sendTransaction` in ethers.js. `msg.data` is encoded data that is sent using the `abi` and `interface` feature in ethers.js. Check out the test case & the `delegateExploit` script

### Files
[Delegation.sol](./contracts/Delegate.sol)
[exploit script](./scripts/delegateExploit.ts)
[test case](./test/unit/delegate.uint.testing.ts)

### Key learning

Key here is to understand how EVM separates logic layer from state layer when using `delegateCall`. From security standpoint, delegateCall can expose 2 vulnerabilities
- mismatch in name of state variable in delegator/delegatee contracts. This could lead to zero states corrupting logic
- order of declaration of state variables - EVM does a one-to-one mapping of state variables in that order -> so any ordermismatch can overwrite wrong state variables 
- when the `delegatee` contract changes state of `delegator` - be absolutely sure that this does not create side effects in state of `delegator` contract that can be exploited 

---

## Challenge 7 - Force

### Challenge
Forcibly increase balance of a `Force` contract

### Vulnerability

Key vulnerability here is to believe that if contract does not have `payable`, there is no way to send eth to this contract. One possible way is to use `selfdestruct` feature of eth -> when self destructing, a contract forcibly sends eth to a contract address, independent of whether it is `payable` or not

I created another contract called `ForceExploit` -> sent it some eth in constructor -> then called `attack()` function which triggers `selfdestruct` with target address to send funds marked as `force` contract. This way we force balance of `force` contract > 0

### Files
[Force.sol & ForceExploiter.sol](./contracts/Force.sol)
[exploit script](./scripts/forceExploit.ts)
[test case](./test/unit/force.uint.testing.ts)

### Key learning

- If a contract logic has `address(this).balance == 0` -> we have learnt that this condition can be violated -> anything inside this if condition can be made to never execute by forcibly sending eth to this contract

- not having a `payable` modifier does not mean a contract cannot receive funds -> yes, it cannot receive funds by normal channels -> but there are other ways than `transfer`, `send` and `call` functions to send eth to a contract

---

## Challenge 8 - Vault

### Challenge
Unlock the vault

### Vulnerability
Storage of state variables in a smart contract are dependent on storage layout rules of EVM. Although a variable is defined as `private`, it does not mean we cannot access that variable onchain - nothing stored onchain is really private in that sense. Storing of passwords and sensitive data onchain introduces vulnerabilities because that data can be accesses by any exploiter if he knows how to use storage layout rules to point to the correct storage location

In current example, bool variable `locked` occupies the 0'th storage slot and `password`, a bytes32 variable, occupies the first slot. I simply use the `getStorageAt` function on provider of ethers.js to access the password. Once I have password, calling the `unlock` function to open vault is trivial


### Files
[Vault.sol](./contracts/Vault.sol)
[exploit script](./scripts/vaultExploit.ts)
[test case](./test/unit/vault.uint.testing.ts)

### Key learning

Key learning is to note that nothing in a contract is really private. Every variable, whether public/private or internal can be accessed by users onchain. 

`Private` is just visibility access. Marking a variable as private only prevents other contracts from accessing it - doesn't mean that user can't access the raw data stored against that variable

So any sensitive data onchain that can exploited should be carefully observed while auditing.


---

## Challenge 9 - King

### Challenge
Block the game once you become the king. Nobody else can be the king

### Vulnerability

Key vulnerability in this challenge is the nature of `transfer` function of solidity. `transfer` function passes a fixed 2300 gas to the fallback - and reverts if the fallback uses more than 2300 gas - so when `receiver` is a contract instead of EOA, transfer function reverts.

To block the game, all we need to do is to make the `transfer` function revert -> when it reverts, new king and new prize is never set -> and effectively the contract gets locked forever. This is a real world case - read more on this [here](http://www.kingoftheether.com/postmortem.html)

### Files
[King.sol & KingExploit.sol](./contracts/King.sol)
[exploit script](./scripts/kingExploit.ts)
[test case](./test/unit/king.uint.testing.ts)

### Key learning

`transfer` function should not be used when receiver can be a `contract` address - even if the expected behaviour is for EOAs to interact with contract, an exploiter can use a `contract` router to block transfers. After Turkey upgrade, if there is a  `transfer` used, always recommend to update to `call` function for safe transfers

---

## Challenge 10 - Reentrancy

### Challenge
Drain all the funds in the pool

### Vulnerability

`Reentrancy` is a classic vulnerability where transfers are made BEFORE updating state in the contract - an exploiter can use the `fallback` function to re-enter the contract and take advantage of the fact that the state is not yet updated.

In the current case, `balances` are updated after `transfer` is executed - so the receiver can re-initiate withdrawal from within the fallback function -> unfortunately, since `balance[receiver]` is not updated, withdrawal will repeat in the loop until all funds are drained from contract


### Files
[Reentrant.sol & ReentrancyExploiter.sol](./contracts/Reentrancy.sol)
[exploit script](./scripts/reentrancyExploit.ts)
[test case](./test/unit/reentrancy.unit.testing.ts)


### Key learning
Most common form of attacks - always look out for transfers out of the contract. Check if `checks-effects-interactions` pattern is used OR if OZ `reentrancy` library is used. Another solution is to let users pull payments rather than contract sending payments to receiver.

For more on this, read [OZ blog](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942/) on DAO attack


---

## Challenge 11 - Elevator

### Challenge
Go to the top floor 

### Vulnerability

This one I couldn't crack without help - key vulnerability here is that an `interface` function is used twice, once outside a `if` block and once inside. Definition of the function can be changed to hack this vulnerability - if I define a function that gives a `false` first time and gives a `true` second time -> I can pass the `if` condition and once inside, on second call, I can set `top` = true

In a normal function, changing logic of same function would not have been possible. But this is an `interface` whose implementation is open ended. And since interface wraps around `msg.sender`, I can define a contract with custom implementation of `isLastFloor` -> I keep a counter and change logic based on number of times function is called.

This is a tricky one - simple yet tricky...

### Files
[Elevator & ElevatorExploit](./contracts/Elevator.sol)
[exploit script](./scripts/elevatorExploit.ts)
[test case](./test/unit/elevator.unit.testing.ts)


### Key Learning

- Key learning is that `interface` functions can take any implementation based on the address that interface points to -> if `interface` wraps around a contract that we can control -> we can always change implementation of a function to suit our needs - this creates vulnerability

- Another learning is that we can make function implementation `state` dependent - same function can have opposite outputs based on a counter -> by controlling number of times we call (which is in our control), we can change behavior of function and hence its side effects


---

## Challenge 12 - Privacy

### Challenge
Unlock privacy 

### Vulnerability

This challenge tests our understanding of storage -> the bytes32[3] array that stores data starts from storage location 3 -> each storage slot takes 32 bytes -> and if a variable is <32 bytes, compiler tries to squeeze it in the same slot until there is overflow -> by that calculation, `locked` is in slot 0, `ID` is in slot 1, variables `flattening`, `denomination`, `awkwardness` are in slot 2 (8 bytes + 8 bytes + 16 bytes = 32 bytes), and `data` is an bytes32 array of 3 elements -> so `data(0)` in slot 3, `data(1)` is in slot 4, `data(2)` in slot5

Once you can access storage, you can unlock contract

### Files
[Privacy](./contracts/Privacy.sol)
[exploit script](./scripts/privacyExploit.ts)
[test case](./test/unit/privacy.unit.testing.ts)


### Key Learning

Again, same learnings as before -> none of variable stored on blockchain are really private. Each state variable is accessible if we know how to search the storage layout -> any contract that stores sensitive information onchain that can change states of contract is vulnerable for exploitation.

When auditing, always be on lookout for variables that `dev` assumes are inaccessible -> if accessing them helps us change state of blockchain, it becomes a critical vulnerability

---