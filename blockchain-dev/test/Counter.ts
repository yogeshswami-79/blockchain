import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Counter", function () {
  it("starts at zero", async function () {
    const counter = await ethers.deployContract("Counter");
    expect(await counter.count()).to.equal(0n);
  });

  it("increment increases count by 1", async function () {
    const counter = await ethers.deployContract("Counter");
    await counter.increment();
    expect(await counter.count()).to.equal(1n);
  });

  it("increment can be called multiple times", async function () {
    const counter = await ethers.deployContract("Counter");
    await counter.increment();
    await counter.increment();
    await counter.increment();
    expect(await counter.count()).to.equal(3n);
  });

  it("decrement reduces count by 1", async function () {
    const counter = await ethers.deployContract("Counter");
    await counter.increment();
    await counter.decrement();
    expect(await counter.count()).to.equal(0n);
  });

  it("decrement reverts when count is already zero", async function () {
    const counter = await ethers.deployContract("Counter");
    await expect(counter.decrement()).to.be.revertedWith("Counter: already zero");
  });

  it("reset sets count to zero", async function () {
    const counter = await ethers.deployContract("Counter");
    await counter.increment();
    await counter.increment();
    await counter.reset();
    expect(await counter.count()).to.equal(0n);
  });

  it("emits Incremented event", async function () {
    const counter = await ethers.deployContract("Counter");
    await expect(counter.increment())
      .to.emit(counter, "Incremented")
      .withArgs(1n);
  });

  it("emits Decremented event", async function () {
    const counter = await ethers.deployContract("Counter");
    await counter.increment();
    await expect(counter.decrement())
      .to.emit(counter, "Decremented")
      .withArgs(0n);
  });

  it("getCount returns same value as count()", async function () {
    const counter = await ethers.deployContract("Counter");
    await counter.increment();
    expect(await counter.getCount()).to.equal(await counter.count());
  });
});
