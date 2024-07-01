module genartory::nft {
    use std::signer;
    use std::vector;
    use std::event::{Self, EventHandle};
    use aptos_std::token::{Self, Token, TokenId};
    use aptos_framework::coin::{Coin};
    use aptos_framework::account;

    use aptos_token_objects::collection;
    
      TokenDataId, create_unlimited_collection, create_tokendata;

    friend genartory::marketplace;
    friend genartory::dao;

    // Errors
    const ENOT_ADMIN: u64 = 0;
    const EINVALID_ROYALTY: u64 = 1;

    // Struct for Admin
    struct Admin has key {
        admin_address: address,
    }

    // Events
    struct CreateCollectionEvent has copy, drop, store {
        creator: address,
        collection_name: vector<u8>,
        uri: vector<u8>,
        description: vector<u8>,
    }

    struct MintNFTEvent has copy, drop, store {
        id: TokenId,
        creator: address,
        content_uri: vector<u8>,
        royalty_percentage: u64,
    }

    struct RoyaltyChangedEvent has copy, drop, store {
        id: TokenId,
        new_royalty_percentage: u64
    }


    // NFT Resource
    struct NFT has key, store {
        id: TokenId,
        creator_address: address,
        content_uri: vector<u8>,
        royalty_percentage: u64,
        collection_name: vector<u8>,
        royalty_payee_address: address
    }

    public fun initialize(account: &signer) {
        assert!(signer::address_of(account) == @genartory, ENOT_ADMIN);
        move_to(account, Admin { admin_address: signer::address_of(account) });
    }
    
    // Function to update royalty percentage of NFT
    public entry fun update_royalty(
        account: &signer, 
        token_id: TokenId,
        new_royalty_percentage: u64
    ) acquires NFT, Admin {
        let admin = borrow_global<Admin>(@genartory);
        assert!(signer::address_of(account) == admin.admin_address, ENOT_ADMIN);
        assert!(new_royalty_percentage <= 100, EINVALID_ROYALTY);

        let token = borrow_global_mut<NFT>(signer::address_of(account), token_id);
        token.royalty_percentage = new_royalty_percentage;

        event::emit_event<RoyaltyChangedEvent>(
            &mut admin.royalty_changed_events,
            RoyaltyChangedEvent {
                id: token_id,
                new_royalty_percentage,
            },
        );
    }

    // Function to check if an NFT exists at a given TokenId
    public fun exists_at(id: TokenId): bool {
        token::exists<NFT>(id)
    }

    public entry fun create_collection(
        account: &signer,
        collection_name: vector<u8>,
        uri: vector<u8>,
        description: vector<u8>,
    ) acquires Admin {
        let admin = borrow_global<Admin>(@genartory);
        assert!(signer::address_of(account) == admin.admin_address, ENOT_ADMIN);

        create_unlimited_collection(account, collection_name, uri, description);
        event::emit(CreateCollectionEvent {
            creator: signer::address_of(account),
            collection_name,
            uri,
            description,
        });
    }

    public entry fun mint_nft(
        account: &signer,
        collection_name: vector<u8>,
        content_uri: vector<u8>,
        royalty_percentage: u64,
    ) acquires Admin {
        let admin = borrow_global<Admin>(@genartory);
        assert!(signer::address_of(account) == admin.admin_address, ENOT_ADMIN);
        assert!(royalty_percentage <= 100, EINVALID_ROYALTY);

        let id = create_tokendata(account, collection_name, content_uri, royalty_percentage);
        let token_id = TokenId { token_data_id: id, property_version: 0 };
        move_to(
            account,
            NFT {
                id: token_id,
                creator_address: signer::address_of(account),
                content_uri,
                royalty_percentage,
                collection_name,
                royalty_payee_address: signer::address_of(account)
            },
        );
        
        event::emit(MintNFTEvent { 
            id: token_id,
            creator: signer::address_of(account), 
            content_uri,
            royalty_percentage
        });
    }

    // ... rest of the functions from the previous response
    module genartory::nft {
    // ... (imports, structs, events, errors from previous code)

    // Functions

    // ... (initialize, exists_at, create_collection, mint_nft, update_royalty from previous code)

    // Transfer NFT
    public entry fun transfer(account: &signer, receiver: address, token_id: TokenId) acquires NFT {
        let sender = signer::address_of(account);
        assert!(token::owns<NFT>(sender, token_id), ENOT_TOKEN_OWNER);
        token::transfer(account, receiver, token_id);
    }

    // Burn NFT
    public entry fun burn(account: &signer, token_id: TokenId) acquires NFT {
        let sender = signer::address_of(account);
        assert!(token::owns<NFT>(sender, token_id), ENOT_TOKEN_OWNER);

        let admin = borrow_global<Admin>(@genartory);
        assert!(sender == admin.admin_address, ENOT_ADMIN);
        let NFT { id: _, creator_address: _, content_uri: _, royalty_percentage: _ , collection_name: _ } = move_from<NFT>(
            sender, token_id
        );
    }
    
    //Get NFT Details
    public fun get_nft_info(id: TokenId): (address, vector<u8>, u64, vector<u8>) acquires NFT {
        let nft = borrow_global<NFT>(token::owner(id), id);
        (nft.creator_address, nft.content_uri, nft.royalty_percentage, nft.collection_name)
    }
}

}
