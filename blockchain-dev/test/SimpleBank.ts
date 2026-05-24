import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

const ONE_ETH = ethers.parseEther("1.0");

describe("SimpleBank", function () {
  it("accepts a deposit and records the balance", async function () {
    const [, alice] = await ethers.getSigners();
    const bank = await ethers.deployContract("SimpleBank");

    await bank.connect(alice).deposit({ value: ONE_ETH });
    expect(await bank.connect(alice).getBalance()).to.equal(ONE_ETH);
  });

  it("emits Deposited event with correct args", async function () {
    const [, alice] = await ethers.getSigners();
    const bank = await ethers.deployContract("SimpleBank");

    await expect(bank.connect(alice).deposit({ value: ONE_ETH }))
      .to.emit(bank, "Deposited")
      .withArgs(alice.address, ONE_ETH);
  });

  it("reverts if no ETH is sent", async function () {
    const bank = await ethers.deployContract("SimpleBank");
    await expect(bank.deposit({ value: 0n })).to.be.revertedWith(
      "Send ETH to deposit"
    );
  });

  it("allows a full withdrawal", async function () {
    const [, alice] = await ethers.getSigners();
    const bank = await ethers.deployContract("SimpleBank");

    await bank.connect(alice).deposit({ value: ONE_ETH });
    await bank.connect(alice).withdraw(ONE_ETH);
    expect(await bank.connect(alice).getBalance()).to.equal(0n);
  });

  it("emits Withdrawn event", async function () {
    const [, alice] = await ethers.getSigners();
    const bank = await ethers.deployContract("SimpleBank");

    await bank.connect(alice).deposit({ value: ONE_ETH });
    await expect(bank.connect(alice).withdraw(ONE_ETH))
      .to.emit(bank, "Withdrawn")
      .withArgs(alice.address, ONE_ETH);
  });

  it("reverts when withdrawing more than balance", async function () {
    const [, alice] = await ethers.getSigners();
    const bank = await ethers.deployContract("SimpleBank");

    await expect(bank.connect(alice).withdraw(ONE_ETH)).to.be.revertedWith(
      "Insufficient balance"
    );
  });

  it("contractBalance reflects deposited ETH", async function () {
    const [, alice, bob] = await ethers.getSigners();
    const bank = await ethers.deployContract("SimpleBank");

    await bank.connect(alice).deposit({ value: ONE_ETH });
    await bank.connect(bob).deposit({ value: ONE_ETH });
    expect(await bank.contractBalance()).to.equal(ONE_ETH * 2n);
  });

  it("balances are isolated per user", async function () {
    const [, alice, bob] = await ethers.getSigners();
    const bank = await ethers.deployContract("SimpleBank");

    await bank.connect(alice).deposit({ value: ONE_ETH });
    expect(await bank.connect(bob).getBalance()).to.equal(0n);
  });
});
