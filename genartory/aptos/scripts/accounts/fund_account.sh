#!/bin/bash

# Check for required arguments
if [ $# -lt 2 ]; then
    echo "Usage: ./fund_account.sh <profile> <account_name>"
    echo "  profile: testnet"  
    echo "  account_name: The name of the account to fund"
    exit 1
fi

# Set profile (testnet) and account name
PROFILE=$1
ACCOUNT_NAME=$2

# Ensure the profile is testnet
if [ "$PROFILE" != "testnet" ]; then
    echo "Error: This script is only for funding accounts on the Aptos testnet."
    exit 1
fi

# Get account address from name
ACCOUNT_ADDRESS=$(aptos account list --profile $PROFILE | grep $ACCOUNT_NAME | awk '{print $1}')

# Check if account exists
if [ -z "$ACCOUNT_ADDRESS" ]; then
    echo "Error: Account with name '$ACCOUNT_NAME' not found on $PROFILE."
    exit 1
fi

# Fund the account
echo "Funding account '$ACCOUNT_NAME' ($ACCOUNT_ADDRESS) on $PROFILE..."
aptos account fund-with-faucet --account $ACCOUNT_ADDRESS

echo "Funding completed successfully!"
