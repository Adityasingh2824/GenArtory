#!/bin/bash

# Check for required arguments
if [ $# -lt 4 ]; then
    echo "Usage: ./vote_on_proposal.sh <profile> <voter_address> <proposal_id> <vote (true/false)>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, voter address, proposal ID, and vote
PROFILE=$1
VOTER_ADDRESS=$2
PROPOSAL_ID=$3
VOTE=$4

# Cast Vote
echo "Casting vote '$VOTE' on proposal '$PROPOSAL_ID' on $PROFILE..."
aptos move run \
    --function-id genartory::dao::vote_on_proposal \
    --account $VOTER_ADDRESS \
    --args "u64:$PROPOSAL_ID" \
    --args "bool:$VOTE" \
    --profile $PROFILE 

echo "Vote cast successfully!"
