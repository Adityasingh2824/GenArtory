#!/bin/bash

# Check for required arguments
if [ $# -lt 4 ]; then
    echo "Usage: ./mint_nft.sh <profile> <collection_name> <content_uri> <royalty_percentage>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, collection name, content URI, and royalty percentage
PROFILE=$1
COLLECTION_NAME=$2
CONTENT_URI=$3
ROYALTY_PERCENTAGE=$4

# Get account address from profile
ACCOUNT_ADDRESS=$(aptos account list --profile $PROFILE | head -n 1 | awk '{print $1}')

# Mint NFT
echo "Minting NFT with URI '$CONTENT_URI' to collection '$COLLECTION_NAME' on $PROFILE..."
aptos move run \
    --function-id genartory::nft::mint_nft \
    --account $ACCOUNT_ADDRESS \
    --args "string:$COLLECTION_NAME" \
    --args "string:$CONTENT_URI" \
    --args "u64:$ROYALTY_PERCENTAGE" \
    --profile $PROFILE 

echo "NFT minted successfully!"
