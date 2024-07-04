module genartory::token_tests {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::coin::{Coin, CoinStore};
    use aptos_framework::account;
    use genartory::token::{Self, GenArtoryCoin};
    use aptos_std::event;

    // Test Scenarios

    // Test 1: Initialize Token (Success)
    #[test(account = @genartory)]
    public entry fun test_initialize_token(account: &signer) {
        let name = string::utf8(b"GenArtoryCoin");
        let symbol = string::utf8(b"GAC");
        let decimals = 8;
        token::initialize(account, b"GenArtoryCoin", b"GAC", decimals);

        // Ensure the GenArtoryCoin resource exists
        assert!(exists<GenArtoryCoin>(@genartory), 0);

        // Check the properties of the GenArtoryCoin resource
        let coin_info = borrow_global<GenArtoryCoin>(@genartory);
        assert!(coin_info.name == name, 0);
        assert!(coin_info.symbol == symbol, 0);
        assert!(coin_info.decimals == decimals, 0);
    }

    // Test 2: Mint Tokens (Success)
    #[test(account = @genartory, recipient = @0x123)]
    public entry fun test_mint_tokens(account: &signer, recipient: &signer) acquires GenArtoryCoin {
        init_module(account);
        let amount: u64 = 1000;
        token::mint(account, signer::address_of(recipient), amount);

        let recipient_balance = coin::balance<GenArtoryCoin>(signer::address_of(recipient));
        assert!(recipient_balance == amount, EINSUFFICIENT_BALANCE);

        // Check if the MintTokenEvent was emitted
        let mint_event = event::next_event_handle<token::MintTokenEvent>(account);
        event::assert_emitted_event<token::MintTokenEvent>(&mint_event, MintTokenEvent{amount: 1000, receiver_address: signer::address_of(recipient)});
    }

    // Test 3: Transfer Tokens (Success)
    #[test(account = @genartory, recipient = @0x123)]
    public entry fun test_transfer_tokens(account: &signer, recipient: &signer) acquires GenArtoryCoin {
        init_module(account);
        let amount: u64 = 1000;
        token::mint(account, signer::address_of(account), amount);

        token::transfer(account, signer::address_of(recipient), amount/2);

        let sender_balance = coin::balance<GenArtoryCoin>(signer::address_of(account));
        assert!(sender_balance == amount / 2, EINSUFFICIENT_BALANCE);
        
        let recipient_balance = coin::balance<GenArtoryCoin>(signer::address_of(recipient));
        assert!(recipient_balance == amount / 2, EINSUFFICIENT_BALANCE);
        
        // Check if the TransferTokenEvent was emitted
        let transfer_event = event::next_event_handle<token::TransferTokenEvent>(account);
        event::assert_emitted_event<token::TransferTokenEvent>(&transfer_event, TransferTokenEvent{sender: signer::address_of(account), receiver: signer::address_of(recipient), amount: amount / 2});
    }

    // Test 4: Burn Tokens (Success)
    #[test(account = @genartory)]
    public entry fun test_burn_tokens(account: &signer) acquires GenArtoryCoin {
        init_module(account);
        let amount: u64 = 1000;
        token::mint(account, signer::address_of(account), amount);
        let initial_balance = coin::balance<GenArtoryCoin>(signer::address_of(account));
        token::burn(account, 500);
        let final_balance = coin::balance<GenArtoryCoin>(signer::address_of(account));
        assert!(initial_balance - final_balance == 500, 0);

        // Check if the BurnTokenEvent was emitted
        let burn_event = event::next_event_handle<token::BurnTokenEvent>(account);
        event::assert_emitted_event<token::BurnTokenEvent>(&burn_event, BurnTokenEvent{amount: 500});
    }
}
