#!/bin/bash

# Check for required arguments
if [ $# -lt 4 ]; then
    echo "Usage: ./buy_nft.sh <profile> <buyer_address> <creator_address> <token_id>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, buyer address, creator address, and token ID
PROFILE=$1
BUYER_ADDRESS=$2
CREATOR_ADDRESS=$3
TOKEN_ID=$4

# Get collection data id hash for the token
COLLECTION_DATA_ID_HASH=$(aptos token get-table-item --profile $PROFILE \
    --table-handle 0x1::token::TokenDatas \
    --key $CREATOR_ADDRESS \
    --field collection_data_id_hash)

# Extract collection name from the table item data
COLLECTION_NAME=$(echo $COLLECTION_DATA_ID_HASH | jq -r '.collection_name')
# Error Handling: Check if NFT exists
NFT_EXISTS=$(aptos token get-table-item --profile $PROFILE \
    --table-handle 0x1::token::TokenOwners \
    --key $CREATOR_ADDRESS \
    --field tokens)

if [[ $NFT_EXISTS == *"token_data_id":{"creator":"$CREATOR_ADDRESS","collection":"$COLLECTION_NAME","name":"$TOKEN_ID"}* ]]; then
    # Buy NFT
    echo "Buying NFT with ID '$TOKEN_ID' from '$CREATOR_ADDRESS' in collection '$COLLECTION_NAME' on $PROFILE..."
    aptos move run \
        --function-id genartory::marketplace::buy_nft \
        --account $BUYER_ADDRESS \
        --args "0x1::aptos_token::TokenId::{creator: $CREATOR_ADDRESS, collection: $COLLECTION_DATA_ID_HASH, name: $TOKEN_ID}" \
        --profile $PROFILE 

    echo "NFT purchase completed successfully!"
else
    echo "Error: NFT with ID '$TOKEN_ID' not found in collection '$COLLECTION_NAME' for seller '$CREATOR_ADDRESS'."
    exit 1
fi
