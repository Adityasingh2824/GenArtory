#!/bin/bash

# Check for required arguments
if [ $# -lt 4 ]; then
    echo "Usage: ./create_proposal.sh <profile> <proposer_address> <proposal_type> <description> [parameters]"
    echo "  profile: devnet or testnet"
    echo "  proposal_type: 0 (Parameter Change), 1 (Code Upgrade), 2 (Other)"
    echo "  parameters: (Optional) Only for parameter change proposals"
    exit 1
fi

# Set profile, proposer address, proposal type, and description
PROFILE=$1
PROPOSER_ADDRESS=$2
PROPOSAL_TYPE=$3
DESCRIPTION=$4

# Check if parameters are provided
if [ $# -eq 5 ]; then
    PARAMETERS=$5
else
    PARAMETERS=""  # Empty string if parameters are not provided
fi


# Create Proposal
echo "Creating proposal on $PROFILE..."
aptos move run \
    --function-id genartory::dao::create_proposal \
    --account $PROPOSER_ADDRESS \
    --args "u8:$PROPOSAL_TYPE" \
    --args "vector<u8>:$(echo -n $DESCRIPTION | xxd -p)" \
    --args "vector<u8>:$(echo -n $PARAMETERS | xxd -p)" \
    --profile $PROFILE 

echo "Proposal created successfully!"
