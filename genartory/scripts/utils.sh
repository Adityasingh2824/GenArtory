#!/bin/bash

# Function to check if a command exists
function command_exists {
    command -v "$1" >/dev/null 2>&1
}

# Function to get account address from name and profile
function get_account_address() {
    local profile=$1
    local account_name=$2
    # Get the account address for the given name in the specified profile
    aptos account list --profile $profile | grep "$account_name" | awk '{print $1}'
}

# Function to display NFT details
function display_nft_details() {
    local profile=$1
    local token_id=$2

    # Extract data from the token data table
    NFT_DATA=$(aptos token get-table-item --profile $PROFILE \
        --table-handle 0x1::token::TokenDatas \
        --key $CREATOR_ADDRESS \
        --field json)

    # Extract relevant information
    CREATOR_ADDRESS=$(echo $NFT_DATA | jq -r '.creator')
    COLLECTION_NAME=$(echo $NFT_DATA | jq -r '.collection')
    CONTENT_URI=$(echo $NFT_DATA | jq -r '.uri')
    ROYALTY_PERCENTAGE=$(echo $NFT_DATA | jq -r '.royalty_points_denominator')

    # Output NFT details
    echo "NFT Information:"
    echo "  Token ID: $token_id"
    echo "  Creator Address: $CREATOR_ADDRESS"
    echo "  Collection Name: $COLLECTION_NAME"
    echo "  Content URI: $CONTENT_URI"
    echo "  Royalty Percentage: $ROYALTY_PERCENTAGE"
}

# Function to get NFT data by token ID
function get_nft_data() {
    local profile=$1
    local owner_address=$2
    local token_id=$3

    # Query the NFT table
    NFT_DATA=$(aptos move view --function-id genartory::nft::get_nft_info \
        --args "0x1::aptos_token::TokenId::{creator: $owner_address, collection: 0x01000000000000000000000000000000000000000a550c18, name: $token_id}" \
        --type-args "genartory::nft::NFT" \
        --profile $profile)

    echo $NFT_DATA
}

# ... other helper functions (e.g., transaction signing, input validation)
# Function to sign a transaction
function sign_transaction() {
    local profile=$1
    local sender_address=$2
    local transaction_payload=$3
  
    echo "Signing transaction for $sender_address on $profile..."
    aptos transaction sign \
        --account $sender_address \
        --profile $profile \
        --output-file signed_transaction.txn \
        $transaction_payload
}

# Function to submit a signed transaction
function submit_transaction() {
    local profile=$1

    echo "Submitting signed transaction to $profile..."
    tx_hash=$(aptos transaction submit --profile $profile signed_transaction.txn)
    echo "Transaction hash: $tx_hash"
}

# Function to validate a positive integer input
function validate_positive_integer() {
    local value=$1

    if ! [[ $value =~ ^[1-9][0-9]*$ ]]; then
        echo "Error: '$value' is not a valid positive integer." >&2
        return 1  # Indicate failure
    fi
    return 0  # Indicate success
}

# Function to validate an Aptos address
function validate_aptos_address() {
    local address=$1

    if ! [[ $address =~ ^0x[0-9a-fA-F]{64}$ ]]; then
        echo "Error: '$address' is not a valid Aptos address." >&2
        return 1
    fi
    return 0
}

# ... (other helper functions you might add)