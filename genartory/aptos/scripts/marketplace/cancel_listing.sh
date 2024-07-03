#!/bin/bash

# Check for required arguments
if [ $# -lt 3 ]; then
    echo "Usage: ./cancel_listing.sh <profile> <creator_address> <token_id>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, creator address, and token ID
PROFILE=$1
CREATOR_ADDRESS=$2
TOKEN_ID=$3

# Get collection data id hash for the token
COLLECTION_DATA_ID_HASH=$(aptos token get-table-item --profile $PROFILE \
    --table-handle 0x1::token::TokenDatas \
    --key $CREATOR_ADDRESS \
    --field collection_data_id_hash)
# Extract collection name from the table item data
COLLECTION_NAME=$(echo $COLLECTION_DATA_ID_HASH | jq -r '.collection_name')


# Check if the NFT is listed
LISTING_EXISTS=$(aptos move view --function-id genartory::marketplace::is_nft_listed \
    --args "0x1::aptos_token::TokenId::{creator: $CREATOR_ADDRESS, collection: $COLLECTION_DATA_ID_HASH, name: $TOKEN_ID}" \
    --profile $PROFILE)
echo "Listing exists: $LISTING_EXISTS"
# Cancel listing (if it exists)
if [ "$LISTING_EXISTS" = "true" ]; then
    echo "Canceling NFT listing with ID '$TOKEN_ID' from '$CREATOR_ADDRESS' in collection '$COLLECTION_NAME' on $PROFILE..."
    aptos move run \
        --function-id genartory::marketplace::cancel_listing \
        --account $CREATOR_ADDRESS \
        --args "0x1::aptos_token::TokenId::{creator: $CREATOR_ADDRESS, collection: $COLLECTION_DATA_ID_HASH, name: $TOKEN_ID}" \
        --profile $PROFILE
    echo "NFT listing canceled successfully!"
else
    echo "Error: NFT with ID '$TOKEN_ID' is not listed."
fi
