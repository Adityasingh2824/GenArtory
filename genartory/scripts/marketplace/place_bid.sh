#!/bin/bash

# Check for required arguments
if [ $# -lt 4 ]; then
    echo "Usage: ./place_bid.sh <profile> <bidder_address> <creator_address> <token_id> <bid_amount>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, bidder address, creator address, token ID, and bid amount
PROFILE=$1
BIDDER_ADDRESS=$2
CREATOR_ADDRESS=$3
TOKEN_ID=$4
BID_AMOUNT=$5

# Get collection data id hash for the token
COLLECTION_DATA_ID_HASH=$(aptos token get-table-item --profile $PROFILE \
    --table-handle 0x1::token::TokenDatas \
    --key $CREATOR_ADDRESS \
    --field collection_data_id_hash)
# Extract collection name from the table item data
COLLECTION_NAME=$(echo $COLLECTION_DATA_ID_HASH | jq -r '.collection_name')
# Place Bid
echo "Placing a bid of $BID_AMOUNT on NFT with ID '$TOKEN_ID' owned by '$CREATOR_ADDRESS' in collection '$COLLECTION_NAME' on $PROFILE..."
aptos move run \
    --function-id genartory::marketplace::place_bid \
    --account $BIDDER_ADDRESS \
    --args "0x1::aptos_token::TokenId::{creator: $CREATOR_ADDRESS, collection: $COLLECTION_DATA_ID_HASH, name: $TOKEN_ID}" \
    --args "u64:$BID_AMOUNT" \
    --profile $PROFILE 

echo "Bid placed successfully!"
