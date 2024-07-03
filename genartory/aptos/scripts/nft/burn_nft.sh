#!/bin/bash

# Check for required arguments
if [ $# -lt 3 ]; then
    echo "Usage: ./burn_nft.sh <profile> <admin_address> <token_id>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile, admin address, and token ID
PROFILE=$1
ADMIN_ADDRESS=$2
TOKEN_ID=$3

# Get the collection name from the token id
COLLECTION_NAME=$(aptos token get-table-item --profile $PROFILE \
    --table-handle 0x1::token::TokenDatas \
    --key $ADMIN_ADDRESS \
    --field collection_data_id_hash \
    --json | jq -r '.collection_name')

# Burn NFT
echo "Burning NFT with ID '$TOKEN_ID' from '$ADMIN_ADDRESS' on $PROFILE..."
aptos move run \
    --function-id genartory::nft::burn \
    --account $ADMIN_ADDRESS \
    --args "0x1::aptos_token::TokenId::{creator: $ADMIN_ADDRESS, collection: 0x01000000000000000000000000000000000000000a550c18, name: $TOKEN_ID}" \
    --profile $PROFILE 

echo "NFT burned successfully!"
