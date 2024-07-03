#!/bin/bash

# Check for required arguments
if [ $# -lt 3 ]; then
    echo "Usage: ./get_nft_info.sh <profile> <owner_address> <token_id>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, owner address, and token ID
PROFILE=$1
OWNER_ADDRESS=$2
TOKEN_ID=$3

# Get NFT information
echo "Fetching NFT information with ID '$TOKEN_ID' owned by '$OWNER_ADDRESS' on $PROFILE..."

# Get the collection name from the token id
COLLECTION_NAME=$(aptos token get-table-item --profile $PROFILE \
    --table-handle 0x1::token::TokenDatas \
    --key $OWNER_ADDRESS \
    --field collection_data_id_hash \
    --json | jq -r '.collection_name')

NFT_INFO=$(aptos move view --profile $PROFILE \
    --function-id genartory::nft::get_nft_info \
    --args "0x1::aptos_token::TokenId::{creator: $OWNER_ADDRESS, collection: 0x01000000000000000000000000000000000000000a550c18, name: $TOKEN_ID}" \
    --type-args "genartory::nft::NFT")

# Parse and display NFT information
CREATOR_ADDRESS=$(echo $NFT_INFO | jq -r '.[0]')
CONTENT_URI=$(echo $NFT_INFO | jq -r '.[1]' | sed 's/\\//g')  # Remove escape characters for correct URI format
ROYALTY_PERCENTAGE=$(echo $NFT_INFO | jq -r '.[2]')

echo "NFT Information:"
echo "  Creator Address: $CREATOR_ADDRESS"
echo "  Content URI: $CONTENT_URI"
echo "  Royalty Percentage: $ROYALTY_PERCENTAGE"
echo "  Collection Name: $COLLECTION_NAME"
