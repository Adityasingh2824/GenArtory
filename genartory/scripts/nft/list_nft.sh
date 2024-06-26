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

# List NFT
echo "Listing NFT with ID '$TOKEN_ID' on $PROFILE for $PRICE..."
aptos move run \
    --function-id genartory::marketplace::list_nft \
    --account $CREATOR_ADDRESS \
    --args "0x1::aptos_token::TokenId::{creator: $CREATOR_ADDRESS, collection: 0x01000000000000000000000000000000000000000a550c18, name: $TOKEN_ID}" \
    --args "u64:$PRICE" \
    --profile $PROFILE 

echo "NFT listing completed successfully!"
