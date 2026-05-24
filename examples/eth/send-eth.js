const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  // Connect to local Hardhat node (start with: npx hardhat node)
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

  // Use Hardhat account #0 (already has 10,000 ETH)
  const sender = new ethers.Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // Hardhat #0
    provider
  );
  const recipient = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Hardhat #1

  // ── Check balances before ─────────────────────────────
  const before = await provider.getBalance(sender.address);
  console.log('Sender before :', ethers.formatEther(before), 'ETH');

  // ── Estimate gas before sending ───────────────────────
  const gasEstimate = await provider.estimateGas({
    from:  sender.address,
    to:    recipient,
    value: ethers.parseEther('1.0'),
  });
  console.log('Gas estimate:', gasEstimate.toString()); // 21000

  // ── Send 1 ETH ────────────────────────────────────────
  const tx = await sender.sendTransaction({
    to:    recipient,
    value: ethers.parseEther('1.0'),  // 1 ETH in wei
  });
  console.log('\nTransaction sent!');
  console.log('  Hash    :', tx.hash);
  console.log('  Nonce   :', tx.nonce);
  console.log('  gasLimit:', tx.gasLimit.toString());

  // ── Wait for confirmation ─────────────────────────────
  const receipt = await tx.wait(1); // wait for 1 block confirmation
  console.log('\nMined in block:', receipt.blockNumber);
  console.log('Gas used      :', receipt.gasUsed.toString());
  console.log('Status        :', receipt.status === 1 ? '✅ Success' : '❌ Failed');

  // ── Fee calculation ───────────────────────────────────
  const feeWei = receipt.gasUsed * receipt.gasPrice;
  console.log('Fee paid      :', ethers.formatEther(feeWei), 'ETH');

  // ── Balances after ────────────────────────────────────
  const after = await provider.getBalance(sender.address);
  console.log('\nSender after  :', ethers.formatEther(after), 'ETH');

  // ── Look up the tx after the fact ────────────────────
  const fetched = await provider.getTransaction(tx.hash);
  console.log('\nFetched tx from chain:');
  console.log('  blockHash:', fetched.blockHash);
  console.log('  chainId  :', fetched.chainId.toString());
}

main().catch(console.error);