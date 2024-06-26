#!/bin/bash

# Check for required arguments
if [ $# -lt 4 ]; then
    echo "Usage: ./create_collection.sh <profile> <collection_name> <uri> <description>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, collection name, URI, and description
PROFILE=$1
COLLECTION_NAME=$2
URI=$3
DESCRIPTION=$4

# Get account address from profile
ACCOUNT_ADDRESS=$(aptos account list --profile $PROFILE | head -n 1 | awk '{print $1}')

# Create collection
echo "Creating collection '$COLLECTION_NAME' on $PROFILE..."
aptos move run \
    --function-id genartory::nft::create_collection \
    --account $ACCOUNT_ADDRESS \
    --args "string:$COLLECTION_NAME" \
    --args "string:$URI" \
    --args "string:$DESCRIPTION" \
    --profile $PROFILE 

echo "Collection '$COLLECTION_NAME' created successfully!"
