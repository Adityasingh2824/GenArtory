#!/bin/bash

# Check for required arguments
if [ $# -lt 4 ]; then
    echo "Usage: ./update_listing.sh <profile> <seller_address> <token_id> <new_price>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, seller address, token ID, and new price
PROFILE=$1
SELLER_ADDRESS=$2
TOKEN_ID=$3
NEW_PRICE=$4

# Get collection data id hash for the token
COLLECTION_DATA_ID_HASH=$(aptos token get-table-item --profile $PROFILE \
    --table-handle 0x1::token::TokenDatas \
    --key $SELLER_ADDRESS \
    --field collection_data_id_hash)

# Extract collection name from the table item data
COLLECTION_NAME=$(echo $COLLECTION_DATA_ID_HASH | jq -r '.collection_name')
# Update Listing
echo "Updating listing for NFT with ID '$TOKEN_ID' in collection '$COLLECTION_NAME' to new price $NEW_PRICE on $PROFILE..."
aptos move run \
    --function-id genartory::marketplace::update_listing \
    --account $SELLER_ADDRESS \
    --args "0x1::aptos_token::TokenId::{creator: $SELLER_ADDRESS, collection: $COLLECTION_DATA_ID_HASH, name: $TOKEN_ID}" \
    --args "u64:$NEW_PRICE" \
    --profile $PROFILE 

echo "NFT listing updated successfully!"
