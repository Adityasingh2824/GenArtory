module genartory::token {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::coin::{Coin, BurnCapability, FreezeCapability, MintCapability};

    struct GenArtoryCoin has key, store {
        burn_cap: BurnCapability<GenArtoryCoin>,
        freeze_cap: FreezeCapability<GenArtoryCoin>,
        mint_cap: MintCapability<GenArtoryCoin>,
        name: String,
        symbol: String,
        decimals: u8,
    }

    // Error Codes
    const ENOT_ADMIN: u64 = 0;
    const EINSUFFICIENT_BALANCE: u64 = 1;

    // Functions
    public fun initialize(account: &signer, name: vector<u8>, symbol: vector<u8>, decimals: u8) {
        assert!(signer::address_of(account) == @genartory, ENOT_ADMIN);
        let (burn_cap, freeze_cap, mint_cap) = Coin::initialize<GenArtoryCoin>(
            account,
            string::utf8(name),
            string::utf8(symbol),
            decimals,
            true, // can_freeze
        );
        move_to(account, GenArtoryCoin { burn_cap, freeze_cap, mint_cap, name: string::utf8(name), symbol: string::utf8(symbol), decimals });
    }

    public entry fun mint(
        account: &signer,
        receiver: address,
        amount: u64,
    ) acquires GenArtoryCoin {
        let sender = signer::address_of(account);
        let coin_store = borrow_global_mut<GenArtoryCoin>(sender);
        Coin::mint<GenArtoryCoin>(amount, &coin_store.mint_cap);
        Coin::deposit<GenArtoryCoin>(receiver, Coin::extract<GenArtoryCoin>(sender, amount));
    }

    public entry fun burn(account: &signer, amount: u64) acquires GenArtoryCoin {
        let sender = signer::address_of(account);
        let coin_store = borrow_global_mut<GenArtoryCoin>(sender);
        let coins_to_burn = Coin::withdraw<GenArtoryCoin>(sender, amount);
        Coin::burn<GenArtoryCoin>(coins_to_burn, &coin_store.burn_cap);
    }

    public entry fun transfer(
        sender: &signer,
        receiver: address,
        amount: u64,
    ) acquires GenArtoryCoin {
        let coins_to_send = Coin::withdraw<GenArtoryCoin>(signer::address_of(sender), amount);
        Coin::deposit<GenArtoryCoin>(receiver, coins_to_send);
    }

    #[test_only]
    public fun setup(account: &signer) {
        initialize(account, b"GenArtoryCoin", b"GAC", 8);
    }

    // Add more unit tests as needed to ensure the contract's correctness
}
