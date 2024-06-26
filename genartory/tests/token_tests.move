module genartory::token_tests {
    use std::signer;
    use aptos_framework::coin::{Coin, CoinStore};
    use genartory::token;

    #[test(account = @genartory)]
    public entry fun test_initialize_mint_burn_and_transfer(account: &signer) acquires GenArtoryCoin {
        // Initialize the GenArtoryCoin
        let name = b"GenArtoryCoin";
        let symbol = b"GAC";
        let decimals = 8;
        token::initialize(account, name, symbol, decimals);

        // Mint tokens to the account
        let mint_amount = 100000000; // 100 GAC (8 decimals)
        token::mint(account, signer::address_of(account), mint_amount);

        // Check if the account has the minted tokens
        let account_coin_store = CoinStore::borrow<GenArtoryCoin>(signer::address_of(account));
        assert!(account_coin_store.coin.value == mint_amount, 0);

        // Burn some tokens
        let burn_amount = 10000000; // 10 GAC
        token::burn(account, burn_amount);

        // Check if the balance is updated after burning
        let account_coin_store = CoinStore::borrow<GenArtoryCoin>(signer::address_of(account));
        assert!(account_coin_store.coin.value == mint_amount - burn_amount, 0);

        // Transfer tokens to another account
        let recipient_address = @0x123; // Replace with a valid address
        let transfer_amount = 50000000; // 50 GAC
        token::transfer(account, recipient_address, transfer_amount);

        // Check sender and receiver balances after transfer
        let account_coin_store = CoinStore::borrow<GenArtoryCoin>(signer::address_of(account));
        assert!(account_coin_store.coin.value == mint_amount - burn_amount - transfer_amount, 0);

        let recipient_coin_store = CoinStore::borrow<GenArtoryCoin>(recipient_address);
        assert!(recipient_coin_store.coin.value == transfer_amount, 0);
    }

    // ... other test cases
}
