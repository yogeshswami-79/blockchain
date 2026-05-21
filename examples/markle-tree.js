const crypto = require('crypto');

function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function buildMerkleRoot(transactions) {
  if (transactions.length === 0) return hash('');

  // Hash each transaction
  let layer = transactions.map(tx => hash(JSON.stringify(tx)));
  console.log('Initial layer:', layer, layer.length);
  console.log('');

  // Combine pairs until only one hash remains
  while (layer.length > 1) {
    console.log('Current layer length:', layer.length, layer.length % 2 !== 0 );
    if (layer.length % 2 !== 0) {
        console.log('Odd number of hashes, duplicating last hash to make it even', layer.length, layer[layer.length - 1]);
        layer.push(layer[layer.length - 1]); // duplicate last if odd
        console.log('Layer after duplication:', layer, layer.length);
    }

    const nextLayer = [];
    for (let i = 0; i < layer.length; i += 2) {
        const combinedHash = hash(layer[i] + layer[i + 1]); // Combine two hashes and hash the result i.e. if i=0 hash[0] + hash[1], if i=2 hash[2] + hash[3] and so on..
        nextLayer.push(combinedHash);
    }

    console.log('Next layer:', nextLayer);
    layer = nextLayer;
  }
  return layer[0]; // the Merkle root
}

const transactions = [
  { from: 'Alice', to: 'Bob',   amount: 10 },
  { from: 'Bob',   to: 'Carol', amount: 5  },
  { from: 'Carol', to: 'Dave',  amount: 3  },
  { from: 'Dave',  to: 'Orca', amount: 1  },
  { from: 'Orca', to: 'Alice',  amount: 3  },
];

console.log('Merkle Root:', buildMerkleRoot(transactions));
// Change any transaction and the root completely changes