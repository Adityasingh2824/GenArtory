module genartory::dao_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use genartory::dao::{Self, DAO, Proposal, Vote};
    use genartory::token::{Self, GenArtoryCoin};

    // Helper Functions

    #[test_only]
    fun initialize_dao(account: &signer) {
        let voting_period = 3600; // 1 hour
        let quorum_threshold = 100;
        let min_balance_to_propose = 100;
        dao::initialize(account, voting_period, quorum_threshold, min_balance_to_propose);
    }

    // Test Scenarios

    #[test(proposer = @0x123, voter1 = @0x456, voter2 = @0x789)]
    public entry fun test_create_proposal_and_vote(
        proposer: &signer, voter1: &signer, voter2: &signer
    ) acquires DAO, Vote {
        initialize_dao(proposer);
        token::setup(proposer);
        // Mint enough GenArtoryCoin for proposer and voters
        token::mint(proposer, signer::address_of(proposer), 1000);
        token::mint(proposer, signer::address_of(voter1), 500);
        token::mint(proposer, signer::address_of(voter2), 200);

        // Create a proposal
        let proposal_type = 0; // Parameter Change
        let description = b"This is a test proposal";
        let parameters = b"0x05"; // Example parameters
        dao::create_proposal(proposer, proposal_type, description, parameters);

        // Vote on the proposal
        dao::vote_on_proposal(voter1, 1, true); // Voter 1 votes yes
        dao::vote_on_proposal(voter2, 1, false); // Voter 2 votes no

        // Verify votes
        let dao_resource = borrow_global<DAO>(@genartory);
        let proposal = table::borrow(&dao_resource.proposals, 1);
        assert!(proposal.yes_votes == 500, 0);
        assert!(proposal.no_votes == 200, 0);
    }

    #[test(proposer = @0x123)]
    public entry fun test_execute_proposal_success(proposer: &signer) acquires DAO, Vote {
        initialize_dao(proposer);
        token::setup(proposer);

        // Mint enough GenArtoryCoin for proposer
        token::mint(proposer, signer::address_of(proposer), 1000);

        // Create a proposal and vote (enough to reach quorum and pass)
        // ... (Similar setup as in the previous test)

        // Advance time beyond voting period
        timestamp::update_global_time_for_testing(3601); // Move 1 second past the voting period

        // Execute the proposal
        dao::execute_proposal(proposer, 1);

        // Verify proposal execution
        let dao_resource = borrow_global<DAO>(@genartory);
        let proposal = table::borrow(&dao_resource.proposals, 1);
        assert!(proposal.executed, 0);

        // Add further assertions to check if the proposal's intended actions were carried out
        // (This would depend on the specific logic you've implemented for different proposal types)
    }
}
