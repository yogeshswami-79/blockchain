// ─────────────────────────────────────────────────────────────────────────────
// Proof of Stake (PoS) — simulation
//
// Used by Ethereum since "The Merge" (Sep 2022).
// Instead of burning electricity to win the right to add a block (PoW),
// validators lock up ("stake") ETH as collateral. The protocol randomly
// picks one validator per slot to PROPOSE the next block, weighted by
// how much ETH they have staked. The rest of the validators then VOTE
// (attest) to confirm it. Dishonest behavior is punished by SLASHING —
// the validator permanently loses a portion of their staked ETH.
//
// Key terms:
//   slot      — a 12-second window in which one block can be proposed
//   epoch     — 32 consecutive slots (~6.4 minutes on Ethereum mainnet)
//   proposer  — the validator chosen to build and broadcast the block
//   attester  — all other validators who vote to confirm the block
//   slashing  — burning part of a misbehaving validator's stake
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');

// ── Validator ────────────────────────────────────────────────────────────────
// Each validator has a name and a stake (ETH locked up as collateral).
// On Ethereum mainnet the minimum stake is 32 ETH per validator.
// More stake = larger share of total stake = higher chance of being chosen.
class Validator {
  constructor(name, stake) {
    this.name  = name;
    this.stake = stake; // ETH staked — mutated by slash()
  }
}

// ── selectValidator ──────────────────────────────────────────────────────────
// Weighted random selection: a validator's odds equal their share of totalStake.
//
// Algorithm — imagine a number line from 0 to totalStake:
//
//   |<── Alice 320 ──>|<── Bob 160 ──>|<─ Charlie 64 ─>|<─ Dave 56 ─>|
//   0               320             480              544            600
//
// We pick a random point on that line (pick = Math.random() * 600).
// Then we walk through each validator, subtracting their stake from pick.
// The first validator that pushes pick to ≤ 0 owns that point → they win.
//
// Example: pick = 250
//   250 − 320 (Alice) = −70  → −70 ≤ 0 → Alice is selected
//
// Example: pick = 400
//   400 − 320 (Alice) = 80   → still > 0, continue
//    80 − 160 (Bob)   = −80  → −80 ≤ 0 → Bob is selected
function selectValidator(validators) {
  const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);
  console.log('totalStake: ', totalStake);

  // Random point anywhere in [0, totalStake)
  let pick = Math.random() * totalStake;
  console.log('pick: ', pick);

  for (const validator of validators) {
    pick -= validator.stake; // shrink pick by this validator's segment
    console.log(`${validator.name} stake: ${validator.stake}, pick: ${pick}`);
    if (pick <= 0) return validator; // we landed inside this validator's segment
  }
  // Unreachable in practice — floating-point safety fallback
}

// ── createBlockHash ───────────────────────────────────────────────────────────
// Simulates hashing the block header. In real Ethereum the block hash covers
// dozens of fields (parent hash, state root, timestamp, …). Here we just hash
// validator name + slot data to produce a unique 64-char hex string per slot.
function createBlockHash(validatorName, data, slot) {
  return crypto
    .createHash('sha256')
    .update(validatorName + data + slot)
    .digest('hex');
}

// ── runEpoch ──────────────────────────────────────────────────────────────────
// Simulates one epoch: runs `blocks` slots back-to-back and prints who proposed
// each block. At the end it prints a win-share summary so you can visually
// confirm that selection frequency tracks stake percentage.
//
// Real Ethereum epoch: 32 slots × 12 sec = ~6.4 minutes.
// Here we default to 6 slots just to keep the output short.
function runEpoch(validators, blocks = 6) {
  // Print the current stake of each validator (changes after slashing)
  console.log('=== Validators ===');
  validators.forEach(v => console.log(`  ${v.name}: ${v.stake} ETH staked`));
  console.log('');

  // Track how many blocks each validator proposes this epoch
  const winCount = {};
  validators.forEach(v => (winCount[v.name] = 0));

  for (let slot = 1; slot <= blocks; slot++) {
    // 1. Protocol picks a proposer for this slot
    const proposer = selectValidator(validators);

    // 2. Proposer builds the block and computes its hash
    const hash = createBlockHash(proposer.name, `slot-${slot}-data`, slot);

    winCount[proposer.name]++;
    console.log(`Slot ${slot} | Proposer: ${proposer.name.padEnd(8)} | Hash: ${hash.slice(0, 20)}...`);
  }

  // Summary: compare win% against stake% — they should roughly match
  console.log('\n=== Blocks proposed per validator ===');
  validators.forEach(v => {
    const share = ((winCount[v.name] / blocks) * 100).toFixed(0);
    console.log(`  ${v.name}: ${winCount[v.name]}/${blocks} blocks (~${share}%) — staked ${v.stake} ETH`);
  });
}

// ── slash ─────────────────────────────────────────────────────────────────────
// Called by the protocol when a validator is provably dishonest.
// Common offences: equivocation (signing two different blocks for the same slot),
// or surround voting (conflicting attestations).
//
// The slashed ETH is burned (removed from supply) — not given to anyone.
// This makes attacking the network economically irrational: you lose the ETH
// you staked, while the attacker would need to acquire a huge amount to matter.
function slash(validator, percent = 10) {
  const penalty = (validator.stake * percent) / 100;
  validator.stake -= penalty; // permanent reduction — lowers future selection odds too
  console.log(`\n[SLASH] ${validator.name} penalized ${percent}% — lost ${penalty} ETH, remaining: ${validator.stake} ETH`);
}

// ── Setup ─────────────────────────────────────────────────────────────────────
// Total stake = 320 + 160 + 64 + 56 = 600 ETH
// Expected selection share:
//   Alice   320/600 = 53%   ← biggest staker, wins most often
//   Bob     160/600 = 27%
//   Charlie  64/600 = 11%
//   Dave     56/600 =  9%   ← smallest staker, wins least often
const validators = [
  new Validator('Alice',   320),
  new Validator('Bob',     160),
  new Validator('Charlie',  64),
  new Validator('Dave',     56),
];

// ── Epoch 1 ───────────────────────────────────────────────────────────────────
console.log('Running 6-slot PoS epoch...\n');
runEpoch(validators, 6);

// ── Slashing event ────────────────────────────────────────────────────────────
// Bob proposes two DIFFERENT blocks for slot 3 (equivocation).
// Other validators detect the contradiction via the signed block headers
// and submit a slashing proof to the chain. Bob loses 10% of his stake.
// His stake drops from 160 → 144, reducing his future selection odds.
console.log('\n--- Bob signs two conflicting blocks (equivocation detected) ---');
slash(validators[1], 10);

// ── Epoch 2 ───────────────────────────────────────────────────────────────────
// Bob's reduced stake (144 vs Alice's 320) means his win-share shrinks.
// New total stake = 320 + 144 + 64 + 56 = 584 ETH
// Bob's new expected share: 144/584 ≈ 25% (was 27%)
console.log('\nRunning next epoch after slashing...\n');
runEpoch(validators, 6);
