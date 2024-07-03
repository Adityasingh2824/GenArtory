#!/bin/bash

# Check for required arguments
if [ $# -lt 2 ]; then
    echo "Usage: ./query_proposal.sh <profile> <proposal_id>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile and proposal ID
PROFILE=$1
PROPOSAL_ID=$2

# Query Proposal
echo "Querying proposal '$PROPOSAL_ID' on $PROFILE..."

# Using `aptos move view`
PROPOSAL_DATA=$(aptos move view --function-id genartory::dao::query_proposal \
    --args "u64:$PROPOSAL_ID" \
    --profile $PROFILE)
# Handle the case where the proposal doesn't exist
if [ -z "$PROPOSAL_DATA" ]; then
    echo "Error: Proposal with ID '$PROPOSAL_ID' not found."
    exit 1
fi

# Parse and display proposal information
PROPOSER=$(echo $PROPOSAL_DATA | jq -r '.[0]')
PROPOSAL_TYPE=$(echo $PROPOSAL_DATA | jq -r '.[1]')
DESCRIPTION=$(echo $PROPOSAL_DATA | jq -r '.[2]' | xxd -r -p)  # Decode from hex
YES_VOTES=$(echo $PROPOSAL_DATA | jq -r '.[3]')
NO_VOTES=$(echo $PROPOSAL_DATA | jq -r '.[4]')
VOTING_END_TIME=$(echo $PROPOSAL_DATA | jq -r '.[5]')
EXECUTED=$(echo $PROPOSAL_DATA | jq -r '.[6]')
PARAMETERS=$(echo $PROPOSAL_DATA | jq -r '.[7]' | xxd -r -p)  # Decode from hex (if exists)

echo "Proposal Information:"
echo "  ID: $PROPOSAL_ID"
echo "  Proposer: $PROPOSER"
echo "  Type: $PROPOSAL_TYPE"
echo "  Description: $DESCRIPTION"
echo "  Yes Votes: $YES_VOTES"
echo "  No Votes: $NO_VOTES"
echo "  Voting Ends: $VOTING_END_TIME"
echo "  Executed: $EXECUTED"

if [ ! -z "$PARAMETERS" ]; then
    echo "  Parameters: $PARAMETERS"
fi
