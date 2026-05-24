const { ethers } = require('ethers');

const mnemonic = 'test test test test test test test test test test test junk';
const hdNode   = ethers.HDNodeWallet.fromPhrase(mnemonic);

// Derive first 5 accounts (same as MetaMask Account 1–5)
for (let i = 0; i < 5; i++) {
  const child = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
  console.log(`Account ${i}: ${child.address}`);
}
// Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266  ← Hardhat #0
// Account 1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8  ← Hardhat #1
// ...