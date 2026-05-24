import { ethers } from "hardhat";

// Run against local node: npx hardhat run scripts/interacts.ts --network localhost

async function main() {
  const [deployer, alice, bob] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // ── Counter ─────────────────────────────────────────────────────────
  console.log("\n── Counter ──");
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();
  console.log("Counter deployed:", await counter.getAddress());

  await counter.increment();
  await counter.increment();
  await counter.increment();
  console.log("Count after 3 increments:", (await counter.count()).toString());

  await counter.decrement();
  console.log("Count after decrement:", (await counter.count()).toString());

  await counter.reset();
  console.log("Count after reset:", (await counter.count()).toString());

  // ── SimpleBank ──────────────────────────────────────────────────────
  console.log("\n── SimpleBank ──");
  const Bank = await ethers.getContractFactory("SimpleBank");
  const bank = await Bank.deploy();
  await bank.waitForDeployment();
  console.log("Bank deployed:", await bank.getAddress());

  const depositTx = await bank.connect(alice).deposit({ value: ethers.parseEther("1.0") });
  await depositTx.wait();
  console.log("Alice deposited 1 ETH");
  console.log("Alice balance:", ethers.formatEther(await bank.connect(alice).getBalance()), "ETH");
  console.log("Contract balance:", ethers.formatEther(await bank.contractBalance()), "ETH");

  // ── MyToken (ERC-20) ────────────────────────────────────────────────
  console.log("\n── MyToken (ERC-20) ──");
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();
  console.log("Token deployed:", await token.getAddress());
  console.log("Total supply:", ethers.formatEther(await token.totalSupply()), "MTK");

  await token.transfer(alice.address, ethers.parseEther("1000"));
  console.log("Alice MTK balance:", ethers.formatEther(await token.balanceOf(alice.address)));

  // ── Ballot ──────────────────────────────────────────────────────────
  console.log("\n── Ballot ──");
  const Ballot = await ethers.getContractFactory("Ballot");
  const ballot = await Ballot.deploy(["Option A", "Option B", "Option C"]);
  await ballot.waitForDeployment();
  console.log("Ballot deployed:", await ballot.getAddress());

  await ballot.connect(alice).vote(0);
  await ballot.connect(bob).vote(0);
  await ballot.connect(deployer).vote(1);
  console.log("Winner:", await ballot.winner());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
