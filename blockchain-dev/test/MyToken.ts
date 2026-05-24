import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

const INITIAL_SUPPLY = 1_000_000n * 10n ** 18n;

describe("MyToken (ERC-20)", function () {
  it("mints initial supply to the deployer", async function () {
    const [owner] = await ethers.getSigners();
    const token = await ethers.deployContract("MyToken", [owner.address]);

    expect(await token.totalSupply()).to.equal(INITIAL_SUPPLY);
    expect(await token.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
  });

  it("has correct name, symbol and decimals", async function () {
    const [owner] = await ethers.getSigners();
    const token = await ethers.deployContract("MyToken", [owner.address]);

    expect(await token.name()).to.equal("MyToken");
    expect(await token.symbol()).to.equal("MTK");
    expect(await token.decimals()).to.equal(18n);
  });

  it("transfers tokens between accounts", async function () {
    const [owner, alice] = await ethers.getSigners();
    const token = await ethers.deployContract("MyToken", [owner.address]);
    const amount = 1000n * 10n ** 18n;

    await token.transfer(alice.address, amount);
    expect(await token.balanceOf(alice.address)).to.equal(amount);
  });

  it("owner can mint additional tokens", async function () {
    const [owner, alice] = await ethers.getSigners();
    const token = await ethers.deployContract("MyToken", [owner.address]);
    const mintAmount = 500n * 10n ** 18n;

    await token.mint(alice.address, mintAmount);
    expect(await token.balanceOf(alice.address)).to.equal(mintAmount);
  });

  it("non-owner cannot mint", async function () {
    const [owner, alice] = await ethers.getSigners();
    const token = await ethers.deployContract("MyToken", [owner.address]);

    await expect(
      token.connect(alice).mint(alice.address, 100n)
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });

  it("allows burning own tokens", async function () {
    const [owner] = await ethers.getSigners();
    const token = await ethers.deployContract("MyToken", [owner.address]);
    const burnAmount = 100n * 10n ** 18n;

    await token.burn(burnAmount);
    expect(await token.totalSupply()).to.equal(INITIAL_SUPPLY - burnAmount);
  });

  it("approve and transferFrom works", async function () {
    const [owner, alice, bob] = await ethers.getSigners();
    const token = await ethers.deployContract("MyToken", [owner.address]);
    const amount = 200n * 10n ** 18n;

    await token.approve(alice.address, amount);
    await token.connect(alice).transferFrom(owner.address, bob.address, amount);
    expect(await token.balanceOf(bob.address)).to.equal(amount);
  });
});
