#!/bin/bash

# Check for required arguments
if [ $# -lt 4 ]; then
    echo "Usage: ./list_nft.sh <profile> <creator_address> <token_id> <price>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, creator address, token ID, and price
PROFILE=$1
CREATOR_ADDRESS=$2
TOKEN_ID=$3
PRICE=$4

# Get collection data id hash for the token
COLLECTION_DATA_ID_HASH=$(aptos token get-table-item --profile $PROFILE \
    --table-handle 0x1::token::TokenDatas \
    --key $CREATOR_ADDRESS \
    --field collection_data_id_hash)
# Extract collection name from the table item data
COLLECTION_NAME=$(echo $COLLECTION_DATA_ID_HASH | jq -r '.collection_name')
# List NFT on marketplace
echo "Listing NFT with ID '$TOKEN_ID' from '$CREATOR_ADDRESS' in collection '$COLLECTION_NAME' on $PROFILE for $PRICE..."
aptos move run \
    --function-id genartory::marketplace::list_nft \
    --account $CREATOR_ADDRESS \
    --args "0x1::aptos_token::TokenId::{creator: $CREATOR_ADDRESS, collection: $COLLECTION_DATA_ID_HASH, name: $TOKEN_ID}" \
    --args "u64:$PRICE" \
    --profile $PROFILE 

echo "NFT listing completed successfully!"
