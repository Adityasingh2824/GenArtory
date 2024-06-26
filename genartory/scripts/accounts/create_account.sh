#!/bin/bash

# Check for required arguments
if [ $# -lt 1 ]; then
    echo "Usage: ./create_account.sh <profile>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile (devnet or testnet)
PROFILE=$1

# Generate a random account name
ACCOUNT_NAME="genartory_user_$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)"

# Create new account
echo "Creating a new account on $PROFILE with name $ACCOUNT_NAME..."
aptos account create --profile $PROFILE --account $ACCOUNT_NAME  # Note the change in argument order

# Get and display new account address
NEW_ACCOUNT_ADDRESS=$(aptos account list --profile $PROFILE | tail -n 1 | awk '{print $1}')
echo "New account address: $NEW_ACCOUNT_ADDRESS"
