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

# Buy NFT
echo "Buying NFT with ID '$TOKEN_ID' from '$CREATOR_ADDRESS' on $PROFILE..."
aptos move run \
    --function-id genartory::marketplace::buy_nft \
    --account $BUYER_ADDRESS \
    --args "0x1::aptos_token::TokenId::{creator: $CREATOR_ADDRESS, collection: 0x01000000000000000000000000000000000000000a550c18, name: $TOKEN_ID}" \
    --profile $PROFILE 

echo "NFT purchase completed successfully!"
