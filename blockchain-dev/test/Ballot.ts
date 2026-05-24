import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

const PROPOSALS = ["Alice", "Bob", "Carol"];

describe("Ballot", function () {
  it("sets the deployer as chairperson", async function () {
    const [owner] = await ethers.getSigners();
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);

    expect(await ballot.chairperson()).to.equal(owner.address);
  });

  it("creates proposals with zero votes", async function () {
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);

    const p = await ballot.proposals(0);
    expect(p.name).to.equal("Alice");
    expect(p.voteCount).to.equal(0n);
  });

  it("voting is open after deployment", async function () {
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);
    expect(await ballot.votingOpen()).to.equal(true);
  });

  it("allows casting a vote and increments voteCount", async function () {
    const [, alice] = await ethers.getSigners();
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);

    await ballot.connect(alice).vote(0);
    const p = await ballot.proposals(0);
    expect(p.voteCount).to.equal(1n);
  });

  it("emits Voted event", async function () {
    const [, alice] = await ethers.getSigners();
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);

    await expect(ballot.connect(alice).vote(1))
      .to.emit(ballot, "Voted")
      .withArgs(alice.address, 1n);
  });

  it("reverts if a voter votes twice", async function () {
    const [, alice] = await ethers.getSigners();
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);

    await ballot.connect(alice).vote(0);
    await expect(ballot.connect(alice).vote(0)).to.be.revertedWith(
      "Already voted"
    );
  });

  it("reverts on invalid proposal index", async function () {
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);
    await expect(ballot.vote(99)).to.be.revertedWith("Invalid proposal");
  });

  it("determines the winner correctly", async function () {
    const [, alice, bob, carol] = await ethers.getSigners();
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);

    await ballot.connect(alice).vote(1); // Bob
    await ballot.connect(bob).vote(1);   // Bob
    await ballot.connect(carol).vote(0); // Alice

    expect(await ballot.winner()).to.equal("Bob");
  });

  it("only chairperson can close voting", async function () {
    const [, alice] = await ethers.getSigners();
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);

    await expect(ballot.connect(alice).closeVoting()).to.be.revertedWith(
      "Not chairperson"
    );
  });

  it("reverts votes after voting is closed", async function () {
    const [owner, alice] = await ethers.getSigners();
    const ballot = await ethers.deployContract("Ballot", [PROPOSALS]);

    await ballot.vote(0);
    await ballot.connect(owner).closeVoting();
    await expect(ballot.connect(alice).vote(1)).to.be.revertedWith(
      "Voting is closed"
    );
  });
});
