

module genartory::nft {
    use std::signer;
    // add use std account
    use std::account;
    //use std::option;
    use std::vector;
    use std::bcs;
    use std::string::{Self, String};
    use std::option::{Self,Option};
    
    use aptos_std::event::{Self, EventHandle};
  //   use aptos_framework::event;
    //use aptos_std::token;//::{Self, TokenId};
    use aptos_token::token ;

    use 0x3::token::TokenId;

    use aptos_token_objects::collection;
    use aptos_token_objects::token as tokenObject;
    use aptos_token_objects::royalty as royalty;

    
    //use aptos_token_objects::{TokenDataId, create_unlimited_collection, create_tokendata};
    
    // use genartory::marketplace;
    // use genartory::dao;

    // Errors
    const ENOT_ADMIN: u64 = 0;
    const EINVALID_ROYALTY: u64 = 1;
    const ENOT_TOKEN_OWNER: u64 = 2;

    // Struct for Admin
    struct Admin has key {
        admin_address: address,
        mint_events: EventHandle<MintNFTEvent>,
        collection_created_events: EventHandle<CreateCollectionEvent>,
        royalty_changed_events: EventHandle<RoyaltyChangedEvent>,
    }

    // Events
    struct CreateCollectionEvent has copy, drop, store {
        creator: address,
        collection_name: String,
        uri: String,
        description: String,
    }

    struct MintNFTEvent has copy, drop, store {
        id: TokenId,
        creator: address,
        content_uri: String,
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
        content_uri: String,
        royalty_percentage: u64,
        collection_name: String,
        royalty_payee_address: address,
        name: String,
        description: Option<String> // Description can be optional
    }

    public fun initialize(account: &signer) {
        assert!(signer::address_of(account) == @genartory, ENOT_ADMIN);
        move_to(account, Admin { 
            admin_address: signer::address_of(account),
            mint_events: account::new_event_handle<MintNFTEvent>(account),
            collection_created_events: account::new_event_handle<CreateCollectionEvent>(account),
            royalty_changed_events: account::new_event_handle<RoyaltyChangedEvent>(account),
        });
    }
/*
    // Function to update royalty percentage of NFT
    public entry fun update_royalty(
        account: &signer, 
        token_id: TokenId,
        new_royalty_percentage: u64
    ) acquires NFT, Admin {
        let sender = signer::address_of(account);
        let admin = borrow_global_mut<Admin>(@genartory);
        assert!(sender == admin.admin_address, ENOT_ADMIN);

        //let token = borrow_global_mut<NFT>(sender, token_id);
        let token = borrow_global_mut<NFT>(sender   );
      //  assert!(token::owns<NFT>(sender, token_id), ENOT_TOKEN_OWNER);
        token.royalty_percentage = new_royalty_percentage;

        event::emit_event<RoyaltyChangedEvent>(
            &mut admin.royalty_changed_events,
            RoyaltyChangedEvent {
                id: token_id,
                new_royalty_percentage,
            },
        );
    }

    // Function to update an existing NFT
    public entry fun update_nft(account: &signer, token_id: TokenId, description: Option<String>) acquires NFT, Admin {
        let sender = signer::address_of(account);
        let admin = borrow_global<Admin>(@genartory);
        assert!(sender == admin.admin_address, ENOT_ADMIN);
     //   assert!(token::owns<NFT>(sender, token_id), ENOT_TOKEN_OWNER);
        //let token = borrow_global_mut<NFT>(sender, token_id);
        let token = borrow_global_mut<NFT>(sender);

        //if (description.is_some)
         {
            token.description = description;
        };
    }
*/
    // Function to check if an NFT exists at a given TokenId
    // public fun exists_at(id: TokenId): bool {
    //     token::exists<NFT>(id)
    // }

//public entry fun create_collection(account: &signer, description: String) {

    public entry fun create_collection(
        account: &signer,
        collection_name:vector<u8>,
        uri: vector<u8>,
        description: vector<u8>,
    )
{
        //let admin = Admin{admin_address: signer::address_of(account)};
        // Assuming create_unlimited_collection takes a name, description, and URI
        let mcollection_name =string::utf8(collection_name);// utf8(b"My Collection");
        let muri = string::utf8(b"http://example.com");
        let mydescription=string::utf8(description);
        let royalty = option::none();
        let token_data_id =  collection::create_unlimited_collection(account, mydescription,mcollection_name, royalty, muri);

    }
/*
    public entry fun create_collection(
        account: &signer,
        collection_name:vector<u8>,
        uri: vector<u8>,
        description: vector<u8>,
    ) acquires Admin {
        let admin = borrow_global_mut<Admin>(@genartory);
        assert!(signer::address_of(account) == admin.admin_address, ENOT_ADMIN);
         // let royalty = 100;//option::none();
        //   let mydesc=string::utf8(description);
        //   let mycollname=string::utf8(collection_name);
        // let myuri=string::utf8(uri);

        // let myroyalty=royalty::create(1,100,signer::address_of(account));
        // let myroyaltyOption=option::some<royalty::Royalty>(myroyalty);
     
     
     
    //     collection::create_unlimited_collection(account,mydesc, mycollname,myroyaltyOption, myuri );
    //     event::emit_event<CreateCollectionEvent>(
    //         &mut admin.collection_created_events,
    //         CreateCollectionEvent {
    //             creator: signer::address_of(account),
    //             collection_name: string::utf8(collection_name),
    //             uri: string::utf8(uri),
    //             description: string::utf8(description),
    //         },
    //     );
    //     
        let collection_name = string::utf8(collection_name);
        let uri = string::utf8( uri);
        let mydescription=string::utf8( description);
        let royalty = option::none();
        let token_data_id =  collection::create_unlimited_collection(account, mydescription,collection_name, royalty, uri);

    

    }
*/
    public entry fun mint_nft(
        account: &signer,
        collection_name: vector<u8>,
        content_uri: vector<u8>,
        name: vector<u8>,
        royalty_percentage: u64,
    ) acquires Admin {
        let admin = borrow_global_mut<Admin>(@genartory);
        assert!(signer::address_of(account) == admin.admin_address, ENOT_ADMIN);
        assert!(royalty_percentage <= 100, EINVALID_ROYALTY);
        let myname=string::utf8(name);
        let mydescription=string::utf8(name);
        let mycollname=string::utf8(collection_name);
        let myuri=string::utf8(content_uri);

        let default_keys =  { vector<String>[string::utf8(b"attack"), string::utf8(b"num_of_use")] };
        let default_vals = { vector<vector<u8>>[bcs::to_bytes<u64>(&10), bcs::to_bytes<u64>(&5)] };
        let default_types ={ vector<String>[string::utf8(b"u64"), string::utf8(b"u64")] } ;
        let mutate_setting = vector<bool>[ false, false, false, false, false, false ];
        let payee_address=signer::address_of(account);


         let token_mut_config = token::create_token_mutability_config(&mutate_setting);
        let id = token::create_tokendata(account, mycollname,myname,mydescription,
        1,
        myuri,payee_address,royalty_percentage,1, token_mut_config,default_keys,default_vals,default_types);
        
        
        
        let token_id = token::create_token_id(id,0);// { token_data_id: id, property_version: 0 };
        move_to(
            account,
            NFT {
                id: token_id,
                creator_address: signer::address_of(account),
                content_uri: string::utf8(content_uri),
                royalty_percentage,
                collection_name: string::utf8(collection_name),
                royalty_payee_address: signer::address_of(account),
                name: string::utf8(name),
                description: option::none<String>() 
            },
        );

        event::emit_event<MintNFTEvent>(
            &mut admin.mint_events,
            MintNFTEvent { 
                id: token_id,
                creator: signer::address_of(account), 
                content_uri: string::utf8(content_uri), 
                royalty_percentage 
            },
        );
    }
/*
    // Transfer NFT
    //public entry fun transfer(account: &signer, receiver: address, token_id: TokenId) acquires NFT {
    public entry fun transfer(account: &signer, receiver: address, token_id: TokenId)  {
        let sender = signer::address_of(account);
    //    assert!(token::owns<NFT>(sender, token_id), ENOT_TOKEN_OWNER);
        token::transfer(account, token_id, receiver,1);
    }

    // Burn NFT
    public entry fun burn(account: &signer, token_id: TokenId) acquires NFT,Admin {
        let sender = signer::address_of(account);
   //     assert!(token::owns<NFT>(sender, token_id), ENOT_TOKEN_OWNER);

        let admin = borrow_global_mut<Admin>(@genartory);
        assert!(sender == admin.admin_address, ENOT_ADMIN);
        let NFT { id: _, creator_address: _, content_uri: _,
         royalty_percentage: _,royalty_payee_address:_ , collection_name: _, name: _, description: _ } = move_from<NFT>(
          //  sender, token_id
          sender
        );
    }
*/    
    //Get NFT Details
    // public fun get_nft_info(id: TokenId): (address, String, u64, String) acquires NFT {
    //     let nft = borrow_global<NFT>(token::owner(id));
    //     (nft.creator_address, nft.content_uri, nft.royalty_percentage, nft.collection_name)
    // }
}
