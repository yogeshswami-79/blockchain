// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Ballot {
    struct Proposal {
        string  name;
        uint256 voteCount;
    }

    address public  chairperson;
    bool    public  votingOpen;
    Proposal[]      public proposals;
    mapping(address => bool) public hasVoted;

    event Voted(address indexed voter, uint256 proposalIndex);
    event VotingClosed(uint256 winnerIndex, string winnerName);

    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Not chairperson");
        _;
    }

    constructor(string[] memory proposalNames) {
        chairperson = msg.sender;
        votingOpen  = true;
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({ name: proposalNames[i], voteCount: 0 }));
        }
    }

    function vote(uint256 proposalIndex) external {
        require(votingOpen, "Voting is closed");
        require(!hasVoted[msg.sender], "Already voted");
        require(proposalIndex < proposals.length, "Invalid proposal");

        hasVoted[msg.sender] = true;
        proposals[proposalIndex].voteCount++;
        emit Voted(msg.sender, proposalIndex);
    }

    function closeVoting() external onlyChairperson {
        votingOpen = false;
        uint256 winIdx = _winningIndex();
        emit VotingClosed(winIdx, proposals[winIdx].name);
    }

    function winner() external view returns (string memory) {
        return proposals[_winningIndex()].name;
    }

    function proposalCount() external view returns (uint256) {
        return proposals.length;
    }

    function _winningIndex() internal view returns (uint256 winIdx) {
        uint256 maxVotes;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVotes) {
                maxVotes = proposals[i].voteCount;
                winIdx   = i;
            }
        }
    }
}
