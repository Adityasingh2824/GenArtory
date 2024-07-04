module genartory::dao_tests {
    use std::signer;
    use std::vector;
    use aptos_std::event;
    use aptos_framework::coin::{Coin, mint};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use genartory::dao::{Self, DAO, Proposal, Vote, PROPOSAL_TYPE_PARAMETER_CHANGE, ENOT_ENOUGH_TOKENS, EPROPOSAL_NOT_FOUND, EVOTING_NOT_STARTED, EVOTING_ENDED, EALREADY_VOTED, EQUORUM_NOT_REACHED, EPROPOSAL_NOT_PASSED, EINVALID_PROPOSAL_TYPE};
    use genartory::nft::{Self, Admin, NFT, create_unlimited_collection, mint_nft, get_nft_info};
    use genartory::token::{Self, GenArtoryCoin, mint, initialize as init_token_module};

    // Helper Functions

    #[test_only]
    fun init_modules(account: &signer) {
        timestamp::set_time_has_started_for_testing(account); // Start time for testing
        init_token_module(account, b"GenArtoryCoin", b"GAC", 8);
        nft::initialize(account);
        dao::initialize(account, 3600, 100, 100); // 1 hour voting period, 100 token quorum, 100 min balance
        // Mint coins for the account
        let coins = mint<Coin>(100000000, account); // Mint 1000 GAC (8 decimals)
        account::deposit(signer::address_of(account), coins);
    }

    #[test_only]
    fun create_dummy_nft(account: &signer): TokenId acquires Admin {
        let collection_name = vector<u8>::from("Test Collection");
        let content_uri = vector<u8>::from("ipfs://my_art_uri");
        let nft_name = vector<u8>::from("Test NFT");
        nft::create_collection(account, collection_name, content_uri, vector<u8>::from("Test Collection Description"));
        nft::mint_nft(account, collection_name, content_uri, nft_name, 10);

        let token_data_id = TokenDataId {
            creator: @genartory,
            collection: string::utf8(collection_name),
            name: string::utf8(content_uri),
        };
        token::create_token_id_raw(token_data_id, 1)
    }

    // Test Scenarios

    // Test 1: Initialize DAO (Success)
    #[test(account = @genartory)]
    public entry fun test_initialize_dao(account: &signer) {
        init_modules(account);
        let dao = borrow_global<DAO>(@genartory);
        assert!(dao.voting_period == 3600, 0);
        assert!(dao.quorum_threshold == 100, 0);
        assert!(dao.min_balance_to_propose == 100, 0);
        assert!(dao.proposal_count == 0, 0);
    }

    // Test 2: Create Proposal (Success)
    #[test(account = @genartory)]
    public entry fun test_create_proposal_success(account: &signer) acquires DAO {
        init_modules(account);

        let description = b"This is a test proposal";
        let parameters = b"0x05"; // Example parameters
        dao::create_proposal(account, PROPOSAL_TYPE_PARAMETER_CHANGE, description, Option::some(parameters));

        // Check that the proposal was created successfully and event emitted
        let dao_resource = borrow_global<DAO>(@genartory);
        assert!(table::contains(dao_resource.proposals, 1), 0);
        let proposal = table::borrow(&dao_resource.proposals, 1);
        assert!(proposal.proposer == signer::address_of(account), 0);
        assert!(proposal.proposal_type == PROPOSAL_TYPE_PARAMETER_CHANGE, 0);
        assert!(proposal.description == string::utf8(description), 0);
        assert!(proposal.parameters == Option::some(parameters), 0);

        let event_handle = dao_resource.proposal_created_events;
        event::assert_emitted_event<dao::ProposalCreatedEvent>(
            &event_handle,
            dao::ProposalCreatedEvent{
                proposal_id: 1,
                proposer: signer::address_of(account),
                proposal_type: PROPOSAL_TYPE_PARAMETER_CHANGE,
                description: string::utf8(description)
            }
        );
    }

    // Test 3: Create Proposal (Failure - Insufficient Tokens)
    #[test(account = @genartory)]
    public entry fun test_create_proposal_insufficient_tokens(account: &signer) acquires DAO {
        init_modules(account);
        token::burn(account, 100000000);
        let result = dao::create_proposal(account, PROPOSAL_TYPE_PARAMETER_CHANGE, b"This is a test proposal", Option::none());
        assert!(result == ENOT_ENOUGH_TOKENS, result);
    }

    // Test 4: Vote on Proposal (Success)
    #[test(proposer = @0x123, voter1 = @0x456)]
    public entry fun test_vote_on_proposal_success(proposer: &signer, voter1: &signer) acquires DAO, Vote {
        init_modules(proposer);
        // ... (rest of the test_vote_on_proposal_success logic is the same)

    }


    // Test 5: Vote on Proposal (Failure - Voting Not Started)
    // ... (rest of the test_vote_on_proposal_fail_not_started logic is the same)

    // Test 6: Vote on Proposal (Failure - Voting Ended)
    // ... (rest of the test_vote_on_proposal_fail_ended logic is the same)


    // Test 7: Execute Proposal (Success - Parameter Change)
    #[test(account = @genartory)]
    public entry fun test_execute_proposal_success_parameter_change(account: &signer) acquires DAO, Vote, NFT {
        init_modules(account);

        // Create a new collection
        let collection_name = string::utf8(b"Test Collection");
        nft::create_collection(account, b"Test Collection", b"https://example.com/collection", b"This is a test collection");
        let nft_id = create_dummy_nft(account);

        // Create a parameter change proposal
        let new_royalty_percentage = 20; // New royalty percentage
        let parameters = vector::empty<u8>();
        vector::append(&mut parameters, b"royalty_percentage");
        vector::append(&mut parameters, bcs::to_bytes(&new_royalty_percentage));
        dao::create_proposal(account, 0, b"Change royalty percentage", Option::some(parameters));

        // Vote on the proposal 
        // Assume voting quorum is met and the proposal passes

        // Advance time beyond the voting period
        timestamp::update_global_time_for_testing(account, 3601); // 1 hour + 1 second

        // Execute the proposal
        dao::execute_proposal(account, 1);

        // Verify that the royalty percentage was updated
        let nft = borrow_global<NFT>(@genartory, nft_id);
        assert!(nft.royalty_percentage == new_royalty_percentage, 0);
    }

    // Test 8: Execute Proposal (Failure - Proposal Not Found)
    // ... (rest of the test_execute_proposal_fail_not_found logic is the same)

    // Test 9: Execute Proposal (Failure - Quorum Not Reached)
    // ... (rest of the test_execute_proposal_fail_quorum logic is the same)

    // Test 10: Execute Proposal (Failure - Proposal Not Passed)
    // ... (rest of the test_execute_proposal_fail_not_passed logic is the same)

    // Add More Tests for other scenarios... (e.g., code upgrade failure, invalid proposal type, etc.)
}


