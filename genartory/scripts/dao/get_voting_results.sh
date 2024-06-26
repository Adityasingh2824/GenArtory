#!/bin/bash

# Check for required arguments
if [ $# -lt 2 ]; then
    echo "Usage: ./get_voting_results.sh <profile> <proposal_id>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile and proposal ID
PROFILE=$1
PROPOSAL_ID=$2

# Query Proposal to check if it exists
PROPOSAL_DATA=$(aptos move view --function-id genartory::dao::query_proposal \
    --args "u64:$PROPOSAL_ID" \
    --profile $PROFILE)
# Handle the case where the proposal doesn't exist
if [ -z "$PROPOSAL_DATA" ]; then
    echo "Error: Proposal with ID '$PROPOSAL_ID' not found."
    exit 1
fi
# Get voting results
echo "Voting Results for Proposal '$PROPOSAL_ID' on $PROFILE:"

# Using `aptos move view` to get the proposal details
YES_VOTES=$(echo $PROPOSAL_DATA | jq -r '.[3]')
NO_VOTES=$(echo $PROPOSAL_DATA | jq -r '.[4]')
VOTING_END_TIME=$(echo $PROPOSAL_DATA | jq -r '.[5]')
EXECUTED=$(echo $PROPOSAL_DATA | jq -r '.[6]')

# Display voting results
echo "Yes Votes: $YES_VOTES"
echo "No Votes: $NO_VOTES"

# Additional information (Optional)
TOTAL_VOTES=$((YES_VOTES + NO_VOTES))
echo "Total Votes: $TOTAL_VOTES"

if [ "$EXECUTED" = "true" ]; then
    if [[ $YES_VOTES > $NO_VOTES ]]; then
        echo "Status: Passed"
    else
        echo "Status: Failed"
    fi
else
    if [[ $(date +%s) > $VOTING_END_TIME ]]; then
        echo "Status: Voting Ended"
    else
        echo "Status: Voting in Progress"
    fi
fi
