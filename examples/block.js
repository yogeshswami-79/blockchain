class Block {
    index;          // number : Position in the chain (0 = Genesis)
    timestamp;      // string : When the block was created
    previousHash;   // hex string : Hash of the prior block — forms the chain link
    merkleRoot;     // hex string : Root hash of all transactions in this block
    transactions;   // array : The actual data (money transfers, contract calls)
    nonce;          // number : A number used for mining (proof of work) i.e. Number miners increment to solve Proof-of-Work
    hash;           // hex string : SHA-256 of all above fields combined
}


// The 51% Attack
// An attacker who controls more than 50% of the network's mining/staking power could rewrite recent history.
// This is why large networks (Bitcoin, Ethereum) are considered secure — the cost to achieve 51% far exceeds the benefit.