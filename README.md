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