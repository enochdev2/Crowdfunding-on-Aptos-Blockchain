import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { aptosClient } from "../utils/aptosClient"; // Utility function to initialize the Aptos
// client
import { Dialog } from "@headlessui/react";
import { MODULE_ADDRESS } from "../constants"; // Your module address (e.g., 0x1d734c9c4abae4da83a98edffd8122a70bc32ea51dd80c6b30a3659d9d03d18d)

import logo from "../assets/crowdfunding.png";

const Hero = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    crowdfund_type: 1,
    deadline: "",
    goal_amount: "",
  });
  const [loading, setLoading] = useState(false);
  console.log("🚀 ~ Hero ~ accountHasList:", accountHasList);

  useEffect(() => {
    console.log("🚀 ~ Hero ~ account?.address:", account?.address);
    if (account?.address) {
      fetchList();
    }
  }, [account?.address]);

  const fetchList = async () => {
    if (!account) return;
    const address = "c5c4804692089498f5020e1c012e58907e881abef82e6230c29f5146346b5559";
    try {
      const crowdfundingResource = await aptosClient().getAccountResource({
        accountAddress: address,
        resourceType: `${MODULE_ADDRESS}::crowdfundings::CrowdfundingPlatform`,
      });
      console.log("🚀 ~ fetchList ~ crowdfundingResource:", crowdfundingResource);
      setAccountHasList(crowdfundingResource != null);
    } catch (e) {
      setAccountHasList(false);
    }
  };

  const addNewCampaign = async () => {
    setLoading(true);
    // const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
    const PLATFORM_OWNER = "c5c4804692089498f5020e1c012e58907e881abef82e6230c29f5146346b5559";

    const APT_DECIMALS = 1e8;
    if (!account) return;
    const transaction: any = {
      data: {
        function: `${MODULE_ADDRESS}::crowdfundings::create_campaign`,
        // typeArguments: [APTOS_COIN],
        functionArguments: [
          PLATFORM_OWNER, // platform_creator
          formData.name,
          formData.description,
          Number(formData.crowdfund_type),
          Number(new Date(formData.deadline).getTime() / 1000), // deadline (seconds)
          Math.floor(Number(formData.goal_amount) * APT_DECIMALS), // deadlineInMinutes as a number (u64)
        ],
        // typeArguments: "entry_function_payload",
      },
    };
    console.log("🚀 ~ addNewCampaign ~ transaction:", transaction);
    try {
      const response = await signAndSubmitTransaction(transaction);
      const res = await aptosClient().waitForTransaction({ transactionHash: response.hash });
      console.log("🚀 ~ addNewCampaign ~ response:", res);
      alert("✅ Campaign Created Successfully!");
      setIsOpen(false);
      await fetchList(); // Re-fetch after the campaign is created
    } catch (error) {
      console.error("Error creating campaign", error);
    }
    setLoading(false);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="relative bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white h-[100vh] flex items-center justify-cente">
      <img
        src={logo}
        alt="Hero"
        className="absolute inset-0 w-full h-[95%] object-cover opacity-30 mix-blend-overlay"
      />
      <div className="relative md:ml-20 py-5 z-10 px-4 bg-black/5 rounded-xl">
        <h1 className=" text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg text-shadow-whit bg-gradient-to-r from-fuchsia  via-orange-500 to-violet text-transparent bg-clip-text">
          Raise-Fi
        </h1>
        <h1 className="text-2xl md:text-3xl font-extrabold leading-tight drop-shadow-lg text-shadow-lg">
          Fund Your Project
        </h1>
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
        <button
          type="button"
          className="mt-6 px-6 py-3 bg-white text-rosewine font-semibold rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
          onClick={() => setIsOpen(true)}
        >
          Create Campaign
        </button>
      </div>

      {/* Right Section */}
      <div className=" hidden flex-1 md:flex justify-center">
        <div className="bg-gray-900/40 rounded-2xl p-6 shadow-lg w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">Active Campaign</h2>
          <div className="bg-indigoDark rounded-xl p-4 mb-4">
            <h3 className="text-xl font-bold text-green-100">Save The Planet</h3>
            <p className="text-gray-400 text-sm mb-2">by GreenWorld Org</p>
            <p className="text-white font-semibold mb-2">$60,416.38 raised</p>
            <p className="text-green-100 text-sm">86.4% funded</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-100 text-sm">
              <span>Backers</span>
              <span className="text-white">1,245</span>
            </div>
            <div className="flex justify-between text-gray-100 text-sm">
              <span>Goal</span>
              <span className="text-white">$70,000</span>
            </div>
            <div className="flex justify-between text-gray-100 text-sm">
              <span>Ends In</span>
              <span className="text-white">12 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-2xl font-bold text-gray-900">Create New Campaign</Dialog.Title>
            <form className="mt-4 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Campaign Name"
                className="w-full px-4 py-2 border rounded-lg text-black"
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Campaign Description"
                className="w-full px-4 py-2 border rounded-lg text-black"
                onChange={handleChange}
              />
              <select
                title="crowdfund_type"
                name="crowdfund_type"
                className="w-full px-4 py-2 border rounded-lg text-black"
                onChange={handleChange}
              >
                <option value={1}>Donation</option>
                <option value={2}>Equity</option>
                <option value={3}>Reward</option>
              </select>
              <input
                title="deadline"
                type="date"
                name="deadline"
                className="w-full px-4 py-2 border rounded-lg text-black"
                onChange={handleChange}
              />
              <input
                type="number"
                name="goal_amount"
                placeholder="Goal Amount (Octas)"
                className="w-full px-4 py-2 border rounded-lg text-black"
                onChange={handleChange}
              />
            </form>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                onClick={addNewCampaign}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
};

export default Hero;
