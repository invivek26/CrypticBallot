pragma solidity ^0.8.0;

contract Voting {
    mapping(address => bool) public hasVoted;
    uint256 public votesA;
    uint256 public votesB;

    function voteA() public {
        require(!hasVoted[msg.sender], "You have already voted.");
        hasVoted[msg.sender] = true;
        votesA++;
    }

    function voteB() public {
        require(!hasVoted[msg.sender], "You have already voted.");
        hasVoted[msg.sender] = true;
        votesB++;
    }
    function getVotes() public view returns (uint256, uint256) {
        return (votesA, votesB);
    }
}
