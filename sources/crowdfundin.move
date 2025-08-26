// module crowdfund::crowdfundings {
//     use aptos_framework::account;
//      use std::signer;
//     use std::vector;
//     use aptos_framework::event;
//     use aptos_std::table::{Self, Table};
//     use aptos_framework::aptos_coin::AptosCoin;
//     use aptos_framework::coin::{Self, Coin};
//     use aptos_framework::aptos_account;


//     /// Error constants
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
//     struct Campaign has store {
//         creator: address,
//         goal_amount: u64,
//         current_amount: u64,
//         vault: Coin<AptosCoin>,
//         vault_balance: u64,   // Holding funds until goal is met
//         active: bool,
//         contributors: vector<address>,
//     }

//     struct TokenVault has store {
//         amount: u64, // Tracks the amount of tokens in the vault
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
//     public entry fun create_campaign(creator: &signer, goal_amount: u64) acquires CrowdfundingPlatform {
//         let creator_addr = signer::address_of(creator);

//         // Ensure platform is initialized
//         assert!(exists<CrowdfundingPlatform>(creator_addr), E_NOT_INITIALIZED);

//         let platform = borrow_global_mut<CrowdfundingPlatform>(creator_addr);

//         // Ensure campaign doesn't already exist
//         assert!(!table::contains(&platform.campaigns, creator_addr), E_CAMPAIGN_ALREADY_EXISTS);

//         // Create new campaign with vault balance
//         let new_campaign = Campaign {
//             creator: creator_addr,
//             goal_amount,
//             current_amount: 0,
//             vault: coin::zero<AptosCoin>(), // Initialize vault with zero balance
//             vault_balance: 0,  // Funds held in vault initially
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

//     // Contribute to a campaign (funds stored in the contract until goal is met)
//     public entry fun contribute(
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
//         // Check if campaign is active
//         assert!(campaign.active, E_CAMPAIGN_INACTIVE);

//         // Withdraw coins from contributor
//         let coins = coin::withdraw<AptosCoin>(contributor, amount);
//         coin::merge(&mut campaign.vault, coins);

//         // Store the coins in the contract (campaign vault)
//         campaign.vault_balance = campaign.vault_balance + amount;

//         // Update the campaign and contributor info
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
        
//         // Check if goal is reached and close the campaign
//         if (campaign.current_amount >= campaign.goal_amount) {
//             campaign.active = false;
//         }
//     }

//     // Withdraw funds only if goal is reached
//     public entry fun withdraw_funds<CoinType>(creator: &signer) acquires CrowdfundingPlatform {
//         let creator_addr = signer::address_of(creator);
//         assert!(exists<CrowdfundingPlatform>(creator_addr), E_NOT_INITIALIZED);
//         let platform = borrow_global_mut<CrowdfundingPlatform>(creator_addr);
//         assert!(table::contains(&platform.campaigns, creator_addr), E_CAMPAIGN_NOT_FOUND);

//         let campaign = table::borrow_mut(&mut platform.campaigns, creator_addr);
//         assert!(campaign.creator == creator_addr, E_CAMPAIGN_NOT_FOUND);
//         assert!(campaign.current_amount >= campaign.goal_amount, E_INSUFFICIENT_FUNDS);  // Goal must be reached
        
//         let amount = coin::value(&campaign.vault);
//         // Withdraw from contract vault (funds held in the contract until goal is met)
//         let wit  = coin::extract(&mut campaign.vault, amount);
//         coin::deposit(creator_addr, wit);

//         // Update campaign details
//         campaign.vault_balance = campaign.vault_balance - amount;
//         campaign.current_amount = campaign.current_amount - amount;
//     }
// }
