#!/bin/bash

# Check for required arguments
if [ $# -lt 1 ]; then
    echo "Usage: ./list_accounts.sh <profile>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile (devnet or testnet)
PROFILE=$1

# Get account list
echo "Accounts on $PROFILE:"
aptos account list --profile $PROFILE

# Get and display balances
for ACCOUNT_ADDRESS in $(aptos account list --profile $PROFILE | awk '{print $1}')
do
    echo -n "$ACCOUNT_ADDRESS: "
    aptos account balance --account $ACCOUNT_ADDRESS --profile $PROFILE | awk '{print $1}'
done
