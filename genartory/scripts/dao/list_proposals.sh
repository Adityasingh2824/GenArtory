#!/bin/bash

# Check for required arguments
if [ $# -lt 1 ]; then
    echo "Usage: ./list_proposals.sh <profile>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile
PROFILE=$1

# Function to get proposal details
get_proposal_details() {
    local proposal_id=$1

    # Using `aptos move view`
    PROPOSAL_DATA=$(aptos move view --function-id genartory::dao::query_proposal \
        --args "u64:$proposal_id" \
        --profile $PROFILE)
    
    if [ -z "$PROPOSAL_DATA" ]; then
        echo "Error: Proposal with ID '$proposal_id' not found."
        exit 1
    fi

    # Parse proposal data
    PROPOSER=$(echo $PROPOSAL_DATA | jq -r '.[0]')
    PROPOSAL_TYPE=$(echo $PROPOSAL_DATA | jq -r '.[1]')
    DESCRIPTION=$(echo $PROPOSAL_DATA | jq -r '.[2]' | xxd -r -p)
    YES_VOTES=$(echo $PROPOSAL_DATA | jq -r '.[3]')
    NO_VOTES=$(echo $PROPOSAL_DATA | jq -r '.[4]')
    VOTING_END_TIME=$(echo $PROPOSAL_DATA | jq -r '.[5]')
    EXECUTED=$(echo $PROPOSAL_DATA | jq -r '.[6]')

    # Display proposal details
    echo "Proposal ID: $proposal_id"
    echo "  Proposer: $PROPOSER"
    echo "  Type: $PROPOSAL_TYPE"
    echo "  Description: $DESCRIPTION"
    echo "  Yes Votes: $YES_VOTES"
    echo "  No Votes: $NO_VOTES"
    echo "  Voting Ends: $VOTING_END_TIME"
    echo "  Executed: $EXECUTED"
    echo "" # Add a blank line for separation
}

# Get total proposal count
PROPOSAL_COUNT=$(aptos move view --function-id genartory::dao::proposal_count \
    --profile $PROFILE)

# List all proposals
echo "Active Proposals on $PROFILE:"
for ((proposal_id=1; proposal_id<=$PROPOSAL_COUNT; proposal_id++)); do
    get_proposal_details $proposal_id
done
