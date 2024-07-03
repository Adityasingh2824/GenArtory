#!/bin/bash

# Check for required arguments
if [ $# -lt 2 ]; then
    echo "Usage: ./execute_proposal.sh <profile> <proposal_id>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile and proposal ID
PROFILE=$1
PROPOSAL_ID=$2

# Execute Proposal
echo "Executing proposal '$PROPOSAL_ID' on $PROFILE..."
aptos move run \
    --function-id genartory::dao::execute_proposal \
    --account $(aptos config get default-account) \  
    --args "u64:$PROPOSAL_ID" \
    --profile $PROFILE 

echo "Proposal execution completed!"
