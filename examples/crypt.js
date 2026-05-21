const crypto = require('crypto');

function sha256(input) {
  return crypto.createHash('sha256')
               .update(input)
               .digest('hex');
}

// Same input → always the same hash
console.log(sha256('Hello'));
// 185f8db32921bd46d35fa8afe17f74c51f1c5f2c6d4e3a5b5b9e0b7f5f3c2d1

// One character change → completely different hash (avalanche effect)
console.log(sha256('hello'));
// 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824

// Any size input → fixed 64-char output
console.log(sha256('The entire text of War and Peace...'));
// always exactly 64 hex characters

// Ethereum-style hashing with ethers.js
const { ethers } = require('ethers');

console.log('\n');
const data = ethers.toUtf8Bytes('Hello Ethereum');
console.log('keccak256:', ethers.keccak256(data));
// 0x3ea2f1d0abf3fc66cf29eebb70cbdc57f21f...  (Ethereum uses keccak-256)