import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { aptosClient } from "../utils/aptosClient"; // Utility function to initialize the Aptos
// client
import { MODULE_ADDRESS } from "../constants"; // Your module address (e.g., 0x1d734c9c4abae4da83a98edffd8122a70bc32ea51dd80c6b30a3659d9d03d18d)

export default function CrowdfundLanding() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
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
    <div className=" w-full min-h-screen  text-white flex items-center justify-center px-8 md:px-20">
      {/* Left Section */}
      {/* <div className="flex-1 max-w-lg">
        <h1 className="text-4xl font-bold leading-tight mb-4">
          Your entire <span className="text-fuchsia">Crowdfunding journey</span>,
          managed in one <span className="text-green-400">unified platform.</span>
        </h1>
        <p className="text-gray-400 mb-6">
          We empower creators and supporters by providing real-time tools to track campaigns, contributions, and rewards — ensuring transparency at every step.
        </p>
        <button className="bg-green-400 text-black px-6 py-3 rounded-full font-medium hover:bg-green-500 transition mb-4">
          Start a Campaign
        </button>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search campaign, creator, or backer..."
            className="w-full px-4 py-2 rounded-full bg-gray-900 text-gray-300 border border-gray-700 focus:outline-none focus:border-green-400"
          />
        </div>
        <p className="text-gray-400 text-sm">
          Or <span className="text-green-400 cursor-pointer">explore campaigns</span>
        </p>
      </div> */}
      <div className=" flex flex-col md:flex-row md:w-full mx-auto gap-x-12 justify-between items-center border border-slate-600 py-6 md:py-1">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className=" md:w-[600px] flex flex-1 items-center justify-center p-4 z-10">
          <div className="mx-auto w-full max-w-lg rounded-2xl bg-black/30 p-6 shadow-xl">
            <label className="text-2xl font-bold text-gray-100">Create New Campaign</label>
            <form className="mt-4 space-y-4">
              <div>
                <label htmlFor="name"> Name </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Campaign Name"
                  className="w-full px-4 py-2 border rounded-lg text-black"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="description"> Description </label>
                <textarea
                  name="description"
                  placeholder="Campaign Description"
                  className="w-full px-4 py-2 border rounded-lg text-black"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label htmlFor="crowdfund_type">Crowdfunding Type</label>
                  <select
                    name="crowdfund_type"
                    title="crowdfund_type"
                    className="w-full px-4 py-2 border rounded-lg text-black"
                    onChange={handleChange}
                  >
                    <option value={1}>Donation</option>
                    <option value={2}>Equity</option>
                    <option value={3}>Reward</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="deadline">Deadline</label>
                  <input
                    type="date"
                    title="date"
                    name="deadline"
                    className="w-full px-4 py-2 border rounded-lg text-black"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="goal_amount"> Goal Amount</label>
                <input
                  type="number"
                  name="goal_amount"
                  placeholder="Goal Amount (Octas)"
                  className="w-full px-4 py-2 border rounded-lg text-black"
                  onChange={handleChange}
                />
              </div>
            </form>

            <div className="mt-6 flex justify-end gap-3">
              
              <button
                className="px-4 py-2 bg-fuchsia text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                onClick={addNewCampaign}
                // onClick={() => addNewCampaign(1000, 60000)}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-center z-10">
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Active Campaign</h2>
            <div className="bg-black rounded-xl p-4 mb-4">
              <h3 className="text-xl font-bold text-fuchsia">Save The Planet</h3>
              <p className="text-gray-400 text-sm mb-2">by GreenWorld Org</p>
              <p className="text-white font-semibold mb-2">$60,416.38 raised</p>
              <p className="text-fuchsia text-sm">86.4% funded</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Backers</span>
                <span className="text-white">1,245</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Goal</span>
                <span className="text-white">$70,000</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Ends In</span>
                <span className="text-white">12 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
