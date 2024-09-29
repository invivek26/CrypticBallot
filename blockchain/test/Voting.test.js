const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
    let votingInstance;

    beforeEach(async () => {
        votingInstance = await Voting.new(); // Deploy a new instance of the contract for each test
    });

    it("should allow a user to vote for A", async () => {
        await votingInstance.voteA({ from: accounts[0] }); // Account 0 votes for A
        const count = await votingInstance.votesA();
        assert.equal(count.toNumber(), 1, "Vote for A not counted correctly");
    });

    it("should allow a user to vote for B", async () => {
        await votingInstance.voteB({ from: accounts[1] }); // Account 1 votes for B
        const count = await votingInstance.votesB();
        assert.equal(count.toNumber(), 1, "Vote for B not counted correctly");
    });

    it("should not allow the same user to vote twice", async () => {
        await votingInstance.voteA({ from: accounts[0] });
        try {
            await votingInstance.voteA({ from: accounts[0] }); // Account 0 tries to vote again
            assert.fail("The vote should not be counted again");
        } catch (error) {
            assert.ok(/revert/.test(error.message), "Error message must contain revert");
        }
    });
});
