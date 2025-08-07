import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { aptosClient } from "../utils/aptosClient"; // Utility function to initialize the Aptos client
import { MODULE_ADDRESS } from "../constants"; // Your module address (e.g., 0x1d734c9c4abae4da83a98edffd8122a70bc32ea51dd80c6b30a3659d9d03d18d)

import logo from "../assets/crowdfunding.png";

const Hero = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  console.log("🚀 ~ Hero ~ accountHasList:", accountHasList)

  useEffect(() => {
    console.log("🚀 ~ Hero ~ account?.address:", account?.address)
    if (account?.address) {
      fetchList();
    }
  }, [account?.address]);

  const fetchList = async () => {
    if (!account) return;
    const address = account.address;
    try {
      const crowdfundingResource = await aptosClient().getAccountResource({
        accountAddress: address,
        resourceType: `${MODULE_ADDRESS}::crowdfundings::CrowdfundingPlatform`,
      });
      console.log("🚀 ~ fetchList ~ crowdfundingResource:", crowdfundingResource)
      setAccountHasList(crowdfundingResource != null);
    } catch (e) {
      setAccountHasList(false);
    }
  };

  const addNewCampaign = async (goal: number, deadlineInMinutes: number) => {
    const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
    if (!account) return;
    const transaction: any = {
      data: {
        function: `${MODULE_ADDRESS}::crowdfunding::initialize_crowdfunding`,
        typeArguments: [APTOS_COIN],
        functionArguments: [
          goal, // goal as a number (u64)
          deadlineInMinutes, // deadlineInMinutes as a number (u64)
        ],
        // typeArguments: "entry_function_payload",
      },
    };
    console.log("🚀 ~ addNewCampaign ~ transaction:", transaction);
    try {
      const response = await signAndSubmitTransaction(transaction);
      const res = await aptosClient().waitForTransaction({ transactionHash: response.hash });
      console.log("🚀 ~ addNewCampaign ~ response:", res)
       await fetchList(); // Re-fetch after the campaign is created
    } catch (error) {
      console.error("Error creating campaign", error);
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white h-[100vh] flex items-center justify-cente">
      <img
        src={logo}
        alt="Hero"
        className="absolute inset-0 w-full h-[95%] object-cover opacity-30 mix-blend-overlay"
      />
      <div className="relative md:ml-20 py-5 z-10 px-4 bg-black/30 rounded-xl">
        <h1 className="text-5xl font-extrabold leading-tight drop-shadow-lg">Raise-Fi</h1>
        <h1 className="text-3xl font-extrabold leading-tight drop-shadow-lg">Fund Your Project</h1>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          At RaiseFi, we empower innovators and creators to bring their groundbreaking ideas to life. Whether you're an
          entrepreneur, a visionary, or a creator with a passion, RaiseFi provides the platform to help you secure the
          funding you need — step by step.
          <br />
          {/* <br />
          Through milestone-based funding, backers can support your project at key stages, giving them the power to
          track progress and have a direct impact on its success. Our transparent, community-driven approach ensures
          that every project is held accountable and moves forward with purpose.
          <br /> */}
          <br />
          Ready to turn your vision into reality? Join RaiseFi today and take the first step toward bringing your
          project to life!
        </p>
        <button className="mt-6 px-6 py-3 bg-white text-rosewine font-semibold rounded-lg shadow-md hover:bg-gray-200 transition duration-300">
          Get Started
        </button>
        <button onClick={() => addNewCampaign(1000, 60000)}>Create Campaign</button>
      </div>
    </section>
  );
};

export default Hero;
