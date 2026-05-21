// Proof of Work (PoW)
// Used by Bitcoin. Miners compete to find a nonce value that,
// when included in the block hash, produces a hash starting with a certain number of zeros (the difficulty target).
// This is computationally expensive — the "work" proves you spent real energy.

// Pro: Extremely battle-tested, very secure.
// Con: Wastes enormous amounts of energy.

const crypto = require('crypto');

function mineBlock(data, difficulty) {
  const target = '0'.repeat(difficulty); // e.g. "0000"
  let nonce = 0;
  let hash  = '';

  const start = Date.now();

  do {
    nonce++;
    hash = crypto
      .createHash('sha256')
      .update(data + nonce)
      .digest('hex');
  } while (!hash.startsWith(target));

  console.log(`Difficulty: ${difficulty} | Nonce: ${nonce} | Time: ${Date.now() - start}ms`);
  console.log(`Hash: ${hash}`);
}

console.log('mine block...');
mineBlock('Block data', 2); // fast (milliseconds)

console.log('mine block...');
mineBlock('Block data', 4); // slower (seconds)

console.log('mine block...');
mineBlock('Block data', 5); // much slower — this is why energy is used!