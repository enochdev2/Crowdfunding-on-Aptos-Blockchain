#[test_only]
module crowdfunding::crowdfundingTests{
    use crowdfunding::crowdfunding;
    use aptos_framework::account;
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::timestamp;

    #[test(fund = @crowdfunding,  donor_a = @0xAA, donor_b = @0xBB, framework = @aptos_framework)]
    #[expected_failure(abort_code = 1)]
    fun test_not_enough_funds(fund: signer, donor_a: signer, donor_b: signer, framework: signer) {
        timestamp::set_time_has_started_for_testing(&framework);
        timestamp::update_global_time_for_test(11000000);
        let goal = 300u64;
        let numberOfMinutes = 1u64;
        let totalMoney = 1000u64;
        
        account::create_account_for_test(signer::address_of(&fund));
        account::create_account_for_test(signer::address_of(&donor_a));
        account::create_account_for_test(signer::address_of(&donor_b));
        account::create_account_for_test(signer::address_of(&framework));
        
        crowdfunding::initialize_crowdfunding<coin::FakeMoney>(&fund, goal, numberOfMinutes);
        coin::create_fake_money(&framework, &donor_a, totalMoney);
        coin::register<coin::FakeMoney>(&donor_b);
        coin::register<coin::FakeMoney>(&fund);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_a), 100);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_b), 500);

        crowdfunding::donate<coin::FakeMoney>(&donor_a, 200);
        crowdfunding::donate<coin::FakeMoney>(&donor_b, 100);
    }


    #[test(fund = @crowdfunding,  donor_a = @0xAA, donor_b = @0xBB, framework = @aptos_framework)]
    #[expected_failure(abort_code = 2)]
    fun test_no_deposit(fund: signer, donor_a: signer, donor_b: signer, framework: signer) {
        timestamp::set_time_has_started_for_testing(&framework);
        timestamp::update_global_time_for_test(11000000);
        let goal = 300u64;
        let numberOfMinutes = 1u64;
        let totalMoney = 1000u64;
        
        account::create_account_for_test(signer::address_of(&fund));
        account::create_account_for_test(signer::address_of(&donor_a));
        account::create_account_for_test(signer::address_of(&donor_b));
        account::create_account_for_test(signer::address_of(&framework));
        
        crowdfunding::initialize_crowdfunding<coin::FakeMoney>(&fund, goal, numberOfMinutes);
        coin::create_fake_money(&framework, &donor_a, totalMoney);
        coin::register<coin::FakeMoney>(&donor_b);
        coin::register<coin::FakeMoney>(&fund);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_a), 500);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_b), 500);

        crowdfunding::donate<coin::FakeMoney>(&donor_a, 200);
        crowdfunding::getRefund<coin::FakeMoney>(&donor_b);
    }


    #[test(fund = @crowdfunding,  donor_a = @0xAA, donor_b = @0xBB, framework = @aptos_framework)]
    #[expected_failure(abort_code = 3)]
    fun test_refund_not_yet_expired(fund: signer, donor_a: signer, donor_b: signer, framework: signer) {
        timestamp::set_time_has_started_for_testing(&framework);
        timestamp::update_global_time_for_test(11000000);
        let goal = 300u64;
        let numberOfMinutes = 1u64;
        let totalMoney = 1000u64;
        
        account::create_account_for_test(signer::address_of(&fund));
        account::create_account_for_test(signer::address_of(&donor_a));
        account::create_account_for_test(signer::address_of(&donor_b));
        account::create_account_for_test(signer::address_of(&framework));
        
        crowdfunding::initialize_crowdfunding<coin::FakeMoney>(&fund, goal, numberOfMinutes);
        coin::create_fake_money(&framework, &donor_a, totalMoney);
        coin::register<coin::FakeMoney>(&donor_b);
        coin::register<coin::FakeMoney>(&fund);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_a), 500);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_b), 500);

        crowdfunding::donate<coin::FakeMoney>(&donor_a, 200);
        crowdfunding::getRefund<coin::FakeMoney>(&donor_a);
    }

    #[test(fund = @crowdfunding,  donor_a = @0xAA, donor_b = @0xBB, framework = @aptos_framework)]
    #[expected_failure(abort_code = 4)]
    fun test_goal_not_reached(fund: signer, donor_a: signer, donor_b: signer, framework: signer) {
        timestamp::set_time_has_started_for_testing(&framework);
        timestamp::update_global_time_for_test(11000000);
        let goal = 300u64;
        let numberOfMinutes = 1u64;
        let totalMoney = 1000u64;
        
        account::create_account_for_test(signer::address_of(&fund));
        account::create_account_for_test(signer::address_of(&donor_a));
        account::create_account_for_test(signer::address_of(&donor_b));
        account::create_account_for_test(signer::address_of(&framework));
        
        crowdfunding::initialize_crowdfunding<coin::FakeMoney>(&fund, goal, numberOfMinutes);
        coin::create_fake_money(&framework, &donor_a, totalMoney);
        coin::register<coin::FakeMoney>(&donor_b);
        coin::register<coin::FakeMoney>(&fund);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_a), 500);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_b), 500);

        crowdfunding::donate<coin::FakeMoney>(&donor_a, 100);
        crowdfunding::donate<coin::FakeMoney>(&donor_b, 100);

        crowdfunding::claimFunds<coin::FakeMoney>(&fund);
    }

    #[test(fund = @crowdfunding,  donor_a = @0xAA, donor_b = @0xBB, framework = @aptos_framework)]
    #[expected_failure(abort_code = 5)]
    fun test_refund_goal_not_reached(fund: signer, donor_a: signer, donor_b: signer, framework: signer) {
        timestamp::set_time_has_started_for_testing(&framework);
        timestamp::update_global_time_for_test(11000000);
        let goal = 300u64;
        let numberOfMinutes = 1u64;
        let totalMoney = 1000u64;
        
        account::create_account_for_test(signer::address_of(&fund));
        account::create_account_for_test(signer::address_of(&donor_a));
        account::create_account_for_test(signer::address_of(&donor_b));
        account::create_account_for_test(signer::address_of(&framework));
        
        crowdfunding::initialize_crowdfunding<coin::FakeMoney>(&fund, goal, numberOfMinutes);
        coin::create_fake_money(&framework, &donor_a, totalMoney);
        coin::register<coin::FakeMoney>(&donor_b);
        coin::register<coin::FakeMoney>(&fund);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_a), 500);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_b), 500);

        crowdfunding::donate<coin::FakeMoney>(&donor_a, 400);
        crowdfunding::getRefund<coin::FakeMoney>(&donor_a);
    }

    #[test(fund = @crowdfunding,  donor_a = @0xAA, donor_b = @0xBB, framework = @aptos_framework)]
    #[expected_failure(abort_code = 6)]
    fun test_only_owner_can_claim(fund: signer, donor_a: signer, donor_b: signer, framework: signer) {
        timestamp::set_time_has_started_for_testing(&framework);
        timestamp::update_global_time_for_test(11000000);
        let goal = 300u64;
        let numberOfMinutes = 1u64;
        let totalMoney = 1000u64;
        
        account::create_account_for_test(signer::address_of(&fund));
        account::create_account_for_test(signer::address_of(&donor_a));
        account::create_account_for_test(signer::address_of(&donor_b));
        account::create_account_for_test(signer::address_of(&framework));
        
        crowdfunding::initialize_crowdfunding<coin::FakeMoney>(&fund, goal, numberOfMinutes);
        coin::create_fake_money(&framework, &donor_a, totalMoney);
        coin::register<coin::FakeMoney>(&donor_b);
        coin::register<coin::FakeMoney>(&fund);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_a), 500);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_b), 500);

        crowdfunding::donate<coin::FakeMoney>(&donor_a, 100);
        crowdfunding::donate<coin::FakeMoney>(&donor_b, 100);

        crowdfunding::claimFunds<coin::FakeMoney>(&donor_a);
    }

    #[test(fund = @crowdfunding,  donor_a = @0xAA, donor_b = @0xBB, framework = @aptos_framework)]
    #[expected_failure(abort_code = 7)]
    fun test_no_cf_init(fund: signer, donor_a: signer, donor_b: signer, framework: signer) {
        timestamp::set_time_has_started_for_testing(&framework);
        timestamp::update_global_time_for_test(11000000);
        //let goal = 300u64;
        //let numberOfMinutes = 1u64;
        let totalMoney = 1000u64;
        
        account::create_account_for_test(signer::address_of(&fund));
        account::create_account_for_test(signer::address_of(&donor_a));
        account::create_account_for_test(signer::address_of(&donor_b));
        account::create_account_for_test(signer::address_of(&framework));
        
        //crowdfunding::initialize_crowdfunding<coin::FakeMoney>(&fund, goal, numberOfMinutes);
        coin::create_fake_money(&framework, &donor_a, totalMoney);
        coin::register<coin::FakeMoney>(&donor_b);
        coin::register<coin::FakeMoney>(&fund);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_a), 500);

        crowdfunding::donate<coin::FakeMoney>(&donor_a, 200);
    }

    #[test(fund = @crowdfunding,  donor_a = @0xAA, donor_b = @0xBB, framework = @aptos_framework)]
    fun test_success(fund: signer, donor_a: signer, donor_b: signer, framework: signer) {
        timestamp::set_time_has_started_for_testing(&framework);
        timestamp::update_global_time_for_test(11000000);
        let goal = 300u64;
        let numberOfMinutes = 1u64;
        let totalMoney = 1000u64;
        
        account::create_account_for_test(signer::address_of(&fund));
        account::create_account_for_test(signer::address_of(&donor_a));
        account::create_account_for_test(signer::address_of(&donor_b));
        account::create_account_for_test(signer::address_of(&framework));
        
        crowdfunding::initialize_crowdfunding<coin::FakeMoney>(&fund, goal, numberOfMinutes);
        coin::create_fake_money(&framework, &donor_a, totalMoney);
        coin::register<coin::FakeMoney>(&donor_b);
        coin::register<coin::FakeMoney>(&fund);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_a), 500);
        coin::transfer<coin::FakeMoney>(&framework, signer::address_of(&donor_b), 500);

        crowdfunding::donate<coin::FakeMoney>(&donor_a, 200);
        crowdfunding::donate<coin::FakeMoney>(&donor_b, 200);

        crowdfunding::claimFunds<coin::FakeMoney>(&fund);
    }
}