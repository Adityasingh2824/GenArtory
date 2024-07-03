#!/bin/bash

# Check for required arguments
if [ $# -lt 4 ]; then
    echo "Usage: ./transfer_nft.sh <profile> <sender_address> <receiver_address> <creator_address> <token_id>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, sender address, receiver address, creator address, and token ID
PROFILE=$1
SENDER_ADDRESS=$2
RECEIVER_ADDRESS=$3
CREATOR_ADDRESS=$4
TOKEN_ID=$5

# Transfer NFT
echo "Transferring NFT with ID '$TOKEN_ID' from '$SENDER_ADDRESS' to '$RECEIVER_ADDRESS' on $PROFILE..."
aptos move run \
    --function-id genartory::nft::transfer \
    --account $SENDER_ADDRESS \
    --args "address:$RECEIVER_ADDRESS" \
    --args "0x1::aptos_token::TokenId::{creator: $CREATOR_ADDRESS, collection: 0x01000000000000000000000000000000000000000a550c18, name: $TOKEN_ID}" \
    --profile $PROFILE 

echo "NFT transfer completed successfully!"
