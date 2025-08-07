module crowdfund::crowdfundings {
    use aptos_framework::account;
    use std::signer;
    use std::vector;
    use aptos_framework::event;
    use aptos_std::table::{Self, Table};
    use aptos_framework::aptos_coin::AptosCoin;
    // use aptos_framework::coin;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_account;

    /// Errors
    const E_NOT_INITIALIZED: u64 = 1;
    /// Errors
    const E_CAMPAIGN_NOT_FOUND: u64 = 2;
    /// Errors
    const E_CAMPAIGN_ALREADY_EXISTS: u64 = 3;
    /// Errors
    const E_CAMPAIGN_INACTIVE: u64 = 4;
    /// Errors
    const E_INSUFFICIENT_FUNDS: u64 = 5;

    // Campaign structure (adding vault_balance)
    struct Campaign has store {
        creator: address,
        goal_amount: u64,
        current_amount: u64,
        vault: Coin<AptosCoin>,
        vault_balance: u64,   // Holding funds until goal is met
        active: bool,
        contributors: vector<address>,
        // contributions: Table<address, u64>, //has copy, drop
    }

    struct TokenVault has store {
    amount: u64, // Tracks the amount of tokens in the vault
}


    // Global storage for campaigns
    struct CrowdfundingPlatform has key {
        campaigns: Table<address, Campaign>,
        create_campaign_events: event::EventHandle<CreateCampaignEvent>,
        contribute_events: event::EventHandle<ContributeEvent>,
    }

    // Events
    struct CreateCampaignEvent has drop, store {
        creator: address,
        goal_amount: u64,
    }

    struct ContributeEvent has drop, store {
        contributor: address,
        campaign_creator: address,
        amount: u64,
    }

    // Initialize the crowdfunding platform
    public entry fun initialize(account: &signer) {
        let platform = CrowdfundingPlatform {
            campaigns: table::new(),
            create_campaign_events: account::new_event_handle<CreateCampaignEvent>(account),
            contribute_events: account::new_event_handle<ContributeEvent>(account),
        };
        move_to(account, platform);
    }

    // Create a new campaign
    public entry fun create_campaign(creator: &signer, goal_amount: u64) acquires CrowdfundingPlatform {
        let creator_addr = signer::address_of(creator);

        // Ensure platform is initialized
        assert!(exists<CrowdfundingPlatform>(creator_addr), E_NOT_INITIALIZED);

        let platform = borrow_global_mut<CrowdfundingPlatform>(creator_addr);

        // Ensure campaign doesn't already exist
        assert!(!table::contains(&platform.campaigns, creator_addr), E_CAMPAIGN_ALREADY_EXISTS);

        // Create new campaign with vault balance
        let new_campaign = Campaign {
            creator: creator_addr,
            goal_amount,
            current_amount: 0,
            vault: coin::zero<AptosCoin>(), // Initialize vault with zero balance
            vault_balance: 0,  // Funds held in vault initially
            active: true,
            contributors: vector::empty(),
            // contributions: table::new(),
        };

        // Add campaign to platform
        table::add(&mut platform.campaigns, creator_addr, new_campaign);

        // Emit event
        event::emit_event(&mut platform.create_campaign_events, 
            CreateCampaignEvent { 
                creator: creator_addr, 
                goal_amount 
            }
        );
    }

    // Contribute to a campaign (funds stored in the contract until goal is met)
    public entry fun contribute(
        contributor: &signer, 
        campaign_creator: address, 
        amount: u64
    ) acquires CrowdfundingPlatform {
        let contributor_addr = signer::address_of(contributor);

        // Ensure platform is initialized
        assert!(exists<CrowdfundingPlatform>(campaign_creator), E_NOT_INITIALIZED);

        let platform = borrow_global_mut<CrowdfundingPlatform>(campaign_creator);

        // Ensure campaign exists
        assert!(table::contains(&platform.campaigns, campaign_creator), E_CAMPAIGN_NOT_FOUND);

        let campaign = table::borrow_mut(&mut platform.campaigns, campaign_creator);
        // Check if campaign is active
        assert!(campaign.active, E_CAMPAIGN_INACTIVE);

        // Withdraw coins from contributor
        let coins = coin::withdraw<AptosCoin>(contributor, amount);
        // let apt_coin = coin::withdraw<AptosCoin>(contributor, amount);
        coin::merge(&mut campaign.vault, coins);

    
        // Store the coins in the contract (campaign vault)
        campaign.vault_balance = campaign.vault_balance + amount;

        // Update the campaign and contributor info
        campaign.current_amount = campaign.current_amount + amount;
        // table::add(&mut campaign.contributions, contributor_addr, amount);
        vector::push_back(&mut campaign.contributors, contributor_addr);

        // Emit contribution event
        event::emit_event(&mut platform.contribute_events, 
            ContributeEvent { 
                contributor: contributor_addr, 
                campaign_creator, 
                amount 
            }
        );
        // Check if goal is reached and close the campaign
        if (campaign.current_amount >= campaign.goal_amount) {
    campaign.active = false;
}

    }

    // Withdraw funds only if goal is reached
    public entry fun withdraw_funds<CoinType>(creator: &signer) acquires CrowdfundingPlatform {
        let creator_addr = signer::address_of(creator);
        assert!(exists<CrowdfundingPlatform>(creator_addr), E_NOT_INITIALIZED);
        let platform = borrow_global_mut<CrowdfundingPlatform>(creator_addr);
        assert!(table::contains(&platform.campaigns, creator_addr), E_CAMPAIGN_NOT_FOUND);

        let campaign = table::borrow_mut(&mut platform.campaigns, creator_addr);
        assert!(campaign.creator == creator_addr, E_CAMPAIGN_NOT_FOUND);
        // assert!(campaign.current_amount >= amount, E_INSUFFICIENT_FUNDS);
        assert!(campaign.current_amount >= campaign.goal_amount, E_INSUFFICIENT_FUNDS);  // Goal must be reached
        let amount = coin::value(&campaign.vault);
        // Withdraw from contract vault (funds held in the contract until goal is met)
        let wit  = coin::extract(&mut campaign.vault, amount);
        coin::deposit(creator_addr, wit );

        // Update campaign details
        campaign.vault_balance = campaign.vault_balance - amount;
        campaign.current_amount = campaign.current_amount - amount;
    }

    // // Refund contributors if goal is not met
    // public entry fun refund_contributor<CoinType>(contributor: &signer, campaign_creator: address) acquires CrowdfundingPlatform {
    //     let contributor_addr = signer::address_of(contributor);
    //     assert!(exists<CrowdfundingPlatform>(campaign_creator), E_NOT_INITIALIZED);
    //     let platform = borrow_global_mut<CrowdfundingPlatform>(campaign_creator);

    //     assert!(table::contains(&platform.campaigns, campaign_creator), E_CAMPAIGN_NOT_FOUND);
    //     let campaign = table::borrow_mut(&mut platform.campaigns, campaign_creator);
    //     assert!(!campaign.active, E_CAMPAIGN_INACTIVE); // Ensure campaign is closed

    //     // Get the contributor's donation amount
    //     assert!(table::contains(&campaign.contributions, contributor_addr), E_INSUFFICIENT_FUNDS);
    //     let contribution = table::remove(&mut campaign.contributions, contributor_addr);

    //     // Refund contributor
    //     let coins = coin::withdraw<CoinType>(campaign_creator, contribution);
    //     aptos_account::deposit_coins<CoinType>(contributor_addr, coins);

    //     // Update vault balance and campaign state
    //     campaign.vault_balance = campaign.vault_balance - contribution;
    //     campaign.current_amount = campaign.current_amount - contribution;
    // }

    // View campaign details
    public fun view_campaign(campaign_creator: address): &Campaign acquires CrowdfundingPlatform {
        assert!(exists<CrowdfundingPlatform>(campaign_creator), E_NOT_INITIALIZED);

        let platform = borrow_global<CrowdfundingPlatform>(campaign_creator);

        assert!(table::contains(&platform.campaigns, campaign_creator), E_CAMPAIGN_NOT_FOUND);

        // *table::borrow(&platform.campaigns, campaign_creator)
        // Instead of copying the Campaign resource, borrow it
 table::borrow(&platform.campaigns, campaign_creator)
    }

    // Unit tests
    #[test_only]
    use std::unit_test;

    // #[test(creator = @0x1)]
    // fun test_create_and_contribute_campaign(creator: &signer) acquires CrowdfundingPlatform {
    //     // Initialize platform
    //     initialize(creator);

    //     // Create campaign
    //     create_campaign(creator, 1000);

    //     // Contribute to campaign
    //     let contributor: address = @0x2; // Simulating a contributor
    //     contribute<CoinType>(&contributor, @0x1, 500);

    //     // View campaign and check status
    //     let campaign = view_campaign(@0x1);
    //     assert!(campaign.goal_amount == 1000, 1);
    //     assert!(campaign.active == true, 2);
    // }
}

























// module crowdfund::crowdfundings {
//     use aptos_framework::account;
//     use std::signer;
//     use std::vector;
//     use aptos_framework::event;
//     use aptos_std::table::{Self, Table};
//     use aptos_framework::coin;
//     use aptos_framework::aptos_account;


//     /// Errors
//     const E_NOT_INITIALIZED: u64 = 1;
//     /// Errors
//     const E_CAMPAIGN_NOT_FOUND: u64 = 2;
//     /// Errors
//     const E_CAMPAIGN_ALREADY_EXISTS: u64 = 3;
//     /// Errors
//     const E_CAMPAIGN_INACTIVE: u64 = 4;
//     /// Errors
//     const E_INSUFFICIENT_FUNDS: u64 = 5;

//     // Campaign structure
//     struct Campaign has store, copy, drop {
//         creator: address,
//         goal_amount: u64,
//         current_amount: u64,
//         active: bool,
//         contributors: vector<address>,
//     }

//     // Global storage for campaigns
//     struct CrowdfundingPlatform has key {
//         campaigns: Table<address, Campaign>,
//         create_campaign_events: event::EventHandle<CreateCampaignEvent>,
//         contribute_events: event::EventHandle<ContributeEvent>,
//     }

//     // Events
//     struct CreateCampaignEvent has drop, store {
//         creator: address,
//         goal_amount: u64,
//     }

//     struct ContributeEvent has drop, store {
//         contributor: address,
//         campaign_creator: address,
//         amount: u64,
//     }

//     // Initialize the crowdfunding platform
//     public entry fun initialize(account: &signer) {
//         let platform = CrowdfundingPlatform {
//             campaigns: table::new(),
//             create_campaign_events: account::new_event_handle<CreateCampaignEvent>(account),
//             contribute_events: account::new_event_handle<ContributeEvent>(account),
//         };
//         move_to(account, platform);
//     }

//     // Create a new campaign
//     public entry fun create_campaign(
//         creator: &signer, 
//         goal_amount: u64
//     ) acquires CrowdfundingPlatform {
//         let creator_addr = signer::address_of(creator);
        
//         // Ensure platform is initialized
//         assert!(exists<CrowdfundingPlatform>(creator_addr), E_NOT_INITIALIZED);
        
//         let platform = borrow_global_mut<CrowdfundingPlatform>(creator_addr);
        
//         // Ensure campaign doesn't already exist
//         assert!(!table::contains(&platform.campaigns, creator_addr), E_CAMPAIGN_ALREADY_EXISTS);
        
//         // Create new campaign
//         let new_campaign = Campaign {
//             creator: creator_addr,
//             goal_amount,
//             current_amount: 0,
//             active: true,
//             contributors: vector::empty(),
//         };
        
//         // Add campaign to platform
//         table::add(&mut platform.campaigns, creator_addr, new_campaign);
        
//         // Emit event
//         event::emit_event(&mut platform.create_campaign_events, 
//             CreateCampaignEvent { 
//                 creator: creator_addr, 
//                 goal_amount 
//             }
//         );
//     }

//     // Contribute to a campaign
//     public entry fun contribute<CoinType>(
//         contributor: &signer, 
//         campaign_creator: address, 
//         amount: u64
//     ) acquires CrowdfundingPlatform {
//         let contributor_addr = signer::address_of(contributor);
        
//         // Ensure platform is initialized
//         assert!(exists<CrowdfundingPlatform>(campaign_creator), E_NOT_INITIALIZED);
        
//         let platform = borrow_global_mut<CrowdfundingPlatform>(campaign_creator);
        
//         // Ensure campaign exists
//         assert!(table::contains(&platform.campaigns, campaign_creator), E_CAMPAIGN_NOT_FOUND);
        
//         let campaign = table::borrow_mut(&mut platform.campaigns, campaign_creator);
//         // Check campaign is active
//         assert!(campaign.active, E_CAMPAIGN_INACTIVE);

//         // Withdraw coin from contributor
//         let coins = coin::withdraw<CoinType>(contributor, amount);
//         // Deposit coin into campaign creator’s account
//         aptos_account::deposit_coins<CoinType>(campaign_creator, coins);
        
        
//         // Update campaign details
//         campaign.current_amount = campaign.current_amount + amount;        
//         vector::push_back(&mut campaign.contributors, contributor_addr);
        
//         // Emit contribution event
//         event::emit_event(&mut platform.contribute_events, 
//             ContributeEvent { 
//                 contributor: contributor_addr, 
//                 campaign_creator, 
//                 amount 
//             }
//         );
        
//         // Optional: Check if goal is reached and close campaign
//         if (campaign.current_amount >= campaign.goal_amount) {
//             campaign.active = false;
//         }
//     }


//     public entry fun withdraw_funds<CoinType>(
//         creator: &signer,
//         amount: u64
//     ) acquires CrowdfundingPlatform {
//         let creator_addr = signer::address_of(creator);
//         assert!(exists<CrowdfundingPlatform>(creator_addr), E_NOT_INITIALIZED);
//         let platform = borrow_global_mut<CrowdfundingPlatform>(creator_addr);
//         assert!(table::contains(&platform.campaigns, creator_addr), E_CAMPAIGN_NOT_FOUND);

//         let campaign = table::borrow_mut(&mut platform.campaigns, creator_addr);
//         assert!(campaign.creator == creator_addr, E_CAMPAIGN_NOT_FOUND);
//         assert!(campaign.current_amount >= amount, E_INSUFFICIENT_FUNDS);

//         let coins = coin::withdraw<CoinType>(creator, amount); // Withdraw from creator’s account
//         aptos_account::deposit_coins<CoinType>(creator_addr, coins); // Deposit back to creator

//         campaign.current_amount = campaign.current_amount - amount;
//     }


//     // View campaign details
//     public fun view_campaign(campaign_creator: address): Campaign acquires CrowdfundingPlatform {
//         assert!(exists<CrowdfundingPlatform>(campaign_creator), E_NOT_INITIALIZED);
        
//         let platform = borrow_global<CrowdfundingPlatform>(campaign_creator);
        
//         assert!(table::contains(&platform.campaigns, campaign_creator), E_CAMPAIGN_NOT_FOUND);
        
//         *table::borrow(&platform.campaigns, campaign_creator)
//     }

//     // Unit tests
//     #[test_only]
//     use std::unit_test;

//     #[test(creator = @0x1)]
//     fun test_create_and_contribute_campaign(creator: &signer) acquires CrowdfundingPlatform {
//         // Initialize platform
//         initialize(creator);
        
//         // Create campaign
//         create_campaign(creator, 1000);
        
//         // View campaign
//         let campaign = view_campaign(signer::address_of(creator));
//         assert!(campaign.goal_amount == 1000, 1);
//         assert!(campaign.active == true, 2);
//     }
// }