module genartory2::nft2 {
    use std::signer;
    use std::account;
    use std::vector;
    use std::string::{Self, String};
    use std::option::{Self,Option};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_token_objects::royalty as royalty;
    // use genartory::marketplace;
    // use genartory::dao;

    // Errors
    const ENOT_ADMIN: u64 = 0;
    const EINVALID_ROYALTY: u64 = 1;
    const ENOT_TOKEN_OWNER: u64 = 2;

    // Struct for Admin


    public fun initialize(account: &signer) {

    }

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
        let muri = string::utf8(uri);
        let mydescription=string::utf8(description);
        let royalty = option::none();
        let token_data_id =  collection::create_unlimited_collection(account, mydescription,mcollection_name, royalty, muri);

    }

    public entry fun mint_token(creator: &signer,
    collection_name: vector<u8>,
    description : vector<u8>,
    token_name: vector<u8>,
    royalty: u64,
    uri: vector<u8>,
    )
    {
        let mcollection_name =string::utf8(collection_name);// utf8(b"My Collection");
        let muri = string::utf8(uri);
        let mydescription=string::utf8(description);
        let mtoken_name=string::utf8(token_name);
        let royalty = option::none();
        let token_data_id = token::create_named_token(creator, mcollection_name,mydescription, mtoken_name, royalty, muri);
    }



}
