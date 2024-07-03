#!/bin/bash

# Check for required arguments
if [ $# -lt 1 ]; then
    echo "Usage: ./get_dao_config.sh <profile>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile
PROFILE=$1

# Get DAO configuration using aptos move view
echo "Fetching DAO configuration on $PROFILE..."
DAO_CONFIG=$(aptos move view --function-id genartory::dao::get_dao_config --profile $PROFILE)

# Handle error if DAO resource not found
if [ -z "$DAO_CONFIG" ]; then
    echo "Error: DAO not initialized."
    exit 1
fi

# Parse and display DAO configuration
PROPOSAL_COUNT=$(echo $DAO_CONFIG | jq -r '.[0]')
VOTING_PERIOD=$(echo $DAO_CONFIG | jq -r '.[1]')
QUORUM_THRESHOLD=$(echo $DAO_CONFIG | jq -r '.[2]')
MIN_BALANCE_TO_PROPOSE=$(echo $DAO_CONFIG | jq -r '.[3]')

echo "DAO Configuration:"
echo "  Total Proposals: $PROPOSAL_COUNT"
echo "  Voting Period (seconds): $VOTING_PERIOD"
echo "  Quorum Threshold: $QUORUM_THRESHOLD"
echo "  Minimum Balance to Propose: $MIN_BALANCE_TO_PROPOSE"
