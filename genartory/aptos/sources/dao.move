module genartory::dao {
    use std::signer;
    use std::string::{Self, String};
    use std::error;
    use std::option::Option; // Add this line
    use aptos_std::event::{Self, EventHandle};
    use aptos_std::table::{Self, Table};
    use aptos_std::account;
    use aptos_std::timestamp;
    use genartory::nft::{Self, NFT}; 
    use genartory::token::{Self, GenArtoryCoin};

    // Proposal Types
    const PROPOSAL_TYPE_PARAMETER_CHANGE: u8 = 0;
    const PROPOSAL_TYPE_CODE_UPGRADE: u8 = 1;

    // Proposal Structure
    struct Proposal has key, store {
        proposer: address,
        proposal_type: u8,
        description: String,
        yes_votes: u64,
        no_votes: u64,
        voting_end_time: u64,
        executed: bool,
        parameters: Option<vector<u8>>, // Change to optional vector<u8> to allow no parameters for some proposals
    }

    // DAO Storage
    struct DAO has key {
        proposals: Table<u64, Proposal>,
        proposal_count: u64,
        voting_period: u64,
        quorum_threshold: u64,
        min_balance_to_propose: u64,
        proposal_created_events: EventHandle<ProposalCreatedEvent>,
        vote_cast_events: EventHandle<VoteCastEvent>,
        proposal_executed_events: EventHandle<ProposalExecutedEvent>,
    }

    // Voting Record
    struct Vote has key, store {
        proposal_id: u64,
        vote: bool,
        voting_power: u64,
    }

    // Events
    struct ProposalCreatedEvent has copy, drop, store {
        proposal_id: u64,
        proposer: address,
        proposal_type: u8,
        description: String,
    }

    struct VoteCastEvent has copy, drop, store {
        proposal_id: u64,
        voter: address,
        vote: bool,
        voting_power: u64,
    }

    struct ProposalExecutedEvent has copy, drop, store {
        proposal_id: u64,
    }


    // Error Codes
    const ENOT_ENOUGH_TOKENS: u64 = 0;
    const EPROPOSAL_NOT_FOUND: u64 = 1;
    const EVOTING_NOT_STARTED: u64 = 2;
    const EVOTING_ENDED: u64 = 3;
    const EALREADY_VOTED: u64 = 4;
    const EQUORUM_NOT_REACHED: u64 = 5;
    const EPROPOSAL_NOT_PASSED: u64 = 6;
    const EINVALID_PROPOSAL_TYPE: u8 = 7;
    const EINVALID_VOTING_PERIOD: u64 = 8;
    const EINVALID_QUORUM_THRESHOLD: u64 = 9;
    const EINVALID_MIN_BALANCE: u64 = 10;

    // Functions

    public fun initialize(account: &signer, voting_period: u64, quorum_threshold: u64, min_balance_to_propose: u64) {
        assert!(voting_period > 0, error::invalid_argument(EINVALID_VOTING_PERIOD));
        assert!(quorum_threshold > 0, error::invalid_argument(EINVALID_QUORUM_THRESHOLD));
        assert!(min_balance_to_propose > 0, error::invalid_argument(EINVALID_MIN_BALANCE));

        move_to(account, DAO {
            proposals: table::new(),
            proposal_count: 0,
            voting_period,
            quorum_threshold,
            min_balance_to_propose,
            proposal_created_events: account::new_event_handle<ProposalCreatedEvent>(account),
            vote_cast_events: account::new_event_handle<VoteCastEvent>(account),
            proposal_executed_events: account::new_event_handle<ProposalExecutedEvent>(account),
        });
    }

    public entry fun create_proposal(
        proposer: &signer, 
        proposal_type: u8, 
        description: vector<u8>,
        parameters: Option<vector<u8>>  
    ) acquires DAO {
        let proposer_address = signer::address_of(proposer);
        let dao = borrow_global_mut<DAO>(@genartory);

        assert!(proposal_type == PROPOSAL_TYPE_PARAMETER_CHANGE || proposal_type == PROPOSAL_TYPE_CODE_UPGRADE, EINVALID_PROPOSAL_TYPE);
        assert!(token::balance_of<GenArtoryCoin>(proposer_address) >= dao.min_balance_to_propose, ENOT_ENOUGH_TOKENS);

        dao.proposal_count = dao.proposal_count + 1;
        let proposal_id = dao.proposal_count;
        let new_proposal = Proposal {
            proposer: proposer_address,
            proposal_type,
            description: string::utf8(description), // Convert description to String
            yes_votes: 0,
            no_votes: 0,
            voting_end_time: timestamp::now_seconds() + dao.voting_period,
            executed: false,
            parameters,
        };
        table::add(dao.proposals, proposal_id, new_proposal);

        event::emit_event<ProposalCreatedEvent>(
            &mut dao.proposal_created_events,
            ProposalCreatedEvent { proposal_id, proposer: proposer_address, proposal_type, description: string::utf8(description) },
        );
    }


    // vote on a proposal 
    public entry fun vote_on_proposal(voter: &signer, proposal_id: u64, vote: bool) acquires DAO, Vote {
        let voter_address = signer::address_of(voter);
        let dao = borrow_global_mut<DAO>(@genartory);

        // Ensure the proposal exists
        assert!(table::contains(dao.proposals, proposal_id), EPROPOSAL_NOT_FOUND);

        // Check if voting is open
        let proposal = table::borrow_mut(dao.proposals, proposal_id);
        assert!(timestamp::now_seconds() < proposal.voting_end_time, EVOTING_ENDED);
        assert!(timestamp::now_seconds() > proposal.voting_end_time - dao.voting_period, EVOTING_NOT_STARTED);

        // Prevent double voting
        assert!(!exists<Vote>(voter_address, proposal_id), EALREADY_VOTED);

        // Get voting power based on token balance
        let voting_power = token::balance_of<GenArtoryCoin>(voter_address);

        // Update proposal votes
        if (vote) {
            proposal.yes_votes = proposal.yes_votes + voting_power;
        } else {
            proposal.no_votes = proposal.no_votes + voting_power;
        };

        // Store the vote
        move_to(voter, Vote { proposal_id, vote, voting_power });

        event::emit_event<VoteCastEvent>(
            &mut dao.vote_cast_events,
            VoteCastEvent { proposal_id, voter: voter_address, vote, voting_power },
        );
    }

    // Function to execute a proposal
    public entry fun execute_proposal(
        executor: &signer,
        proposal_id: u64
    ) acquires DAO {
        let dao = borrow_global_mut<DAO>(@genartory);

        // Ensure the proposal exists and hasn't been executed
        assert!(table::contains(dao.proposals, proposal_id), EPROPOSAL_NOT_FOUND);
        let proposal = table::borrow_mut(dao.proposals, proposal_id);
        assert!(!proposal.executed, EALREADY_EXECUTED);

        // Check if voting has ended
        assert!(timestamp::now_seconds() >= proposal.voting_end_time, EVOTING_NOT_ENDED);

        // Check if quorum is reached and proposal passed
        let total_votes = proposal.yes_votes + proposal.no_votes;
        assert!(total_votes >= dao.quorum_threshold, EQUORUM_NOT_REACHED);
        assert!(proposal.yes_votes > proposal.no_votes, EPROPOSAL_NOT_PASSED);

        
// Execute proposal based on type
if (proposal.proposal_type == PROPOSAL_TYPE_PARAMETER_CHANGE) {
    // Parameter Change Proposal: Update parameters in the nft module
    if (option::is_some(&proposal.parameters)) {
        let parameters = *option::borrow(&proposal.parameters);
        nft::update_parameters(executor, &parameters);
    } else {
        abort EINVALID_PROPOSAL_DATA; // Parameters are missing for this type
    };
} else if (proposal.proposal_type == PROPOSAL_TYPE_CODE_UPGRADE) {
    // Code Upgrade Proposal: Trigger the upgrade process (more complex)
    // This would involve using the Aptos framework's upgrade capabilities.
    abort EINVALID_PROPOSAL_TYPE; // Temporary placeholder, as code upgrades are not implemented yet
} else {
    abort EINVALID_PROPOSAL_TYPE; // Handle other potential proposal types or raise an error
};

// Mark proposal as executed
proposal.executed = true;

event::emit_event<ProposalExecutedEvent>(
    &mut dao.proposal_executed_events,
    ProposalExecutedEvent { proposal_id },
);
