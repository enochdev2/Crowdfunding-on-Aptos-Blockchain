import { useToast } from "@/components/ui/use-toast";
import { Campaign } from "@/lib/types";
import {
  APT_DECIMALS,
  convertAmountFromHumanReadableToOnChain,
  convertAmountFromOnChainToHumanReadable,
} from "@/utils/helpers";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Dialog, Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import donate from "../../assets/donate.png";
import { MODULE_ADDRESS } from "../../constants";
import { aptosClient } from "../../utils/aptosClient";

const CampaignDetailPage = () => {
  const { creator } = useParams(); // get creator address from URL
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();
  const { account, signAndSubmitTransaction } = useWallet();
  const [goal, setGoal] = useState<number>(1000);
  const [description, setDescription] = useState<String>("");
  const [name, setName] = useState<String>("");
  const [contributor, setContributor] = useState<[]>([]);
  const [funding, setFunding] = useState<number>(550);
  const [deadline, setDeadline] = useState<number>(Date.now() + 60 * 60 * 1000);
  const [amount, setAmount] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);

  const progress = Math.min((funding / goal) * 100, 100);

  useEffect(() => {
    if (creator) {
      fetchCampaignDetails();
    }
  }, [creator]);


  const fetchCampaignDetails = async () => {
    const PLATFORM_OWNER = "c5c4804692089498f5020e1c012e58907e881abef82e6230c29f5146346b5559";
    try {
      const crowdfundingResource = await aptosClient().getAccountResource({
        accountAddress: PLATFORM_OWNER, // module storage address
        resourceType: `${MODULE_ADDRESS}::crowdfundings::CrowdfundingPlatform`,
      });

      const tableHandle = (crowdfundingResource as any).campaigns.handle;

      // Fetch the campaign by id
      const campaign: Campaign = await aptosClient().getTableItem({
        handle: tableHandle,
        data: {
          key_type: "address",
          value_type: `${MODULE_ADDRESS}::crowdfundings::Campaign`,
          key: creator,
        },
      });

      console.log("✅ Single campaign:", campaign);

      // update state
      setCampaign(campaign);
      setGoal(Number(campaign.goal_amount));
      setDescription(campaign.description);
      setName(campaign.name);
      //@ts-ignore
      setContributor(campaign.contributors);
      setFunding(Number(campaign.current_amount));
      setDeadline(Number(campaign.deadline) * 1000); // convert to ms
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      return null;
    }
  };

  const handleDonate = async () => {
    if (!account) return;
    // const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
    const PLATFORM_OWNER = "c5c4804692089498f5020e1c012e58907e881abef82e6230c29f5146346b5559";
    const amounts = convertAmountFromHumanReadableToOnChain(Number(amount), APT_DECIMALS);
    console.log("🚀 ~ handleDonate ~ amount:");
    const transaction: any = {
      data: {
        function: `${MODULE_ADDRESS}::crowdfundings::contribute`,
        // typeArguments: [APTOS_COIN],
        functionArguments: [
          PLATFORM_OWNER, // platform creator
          creator,
          Number(amounts), // donation amount in u64
        ],
      },
    };
    console.log("🚀 ~ handleDonate ~ transaction:", transaction);
    try {
      //  const committedTxn = await aptos.signAndSubmitTransaction({ signer: alice, transaction: txn });
      const response = await signAndSubmitTransaction(transaction);
      await aptosClient().waitForTransaction({ transactionHash: response.hash });
      console.log("🚀 ~ handleDonate ~ response:", response);
      toast({
        variant: "default",
        title: "success",
        description: "Transaction successful",
      });
      fetchCampaignDetails(); // Re-fetch after donation is made
      setAmount(0);
      setIsOpen(false);
    } catch (error) {
      console.error("Error donating", error);
    }
  };

  const WithdrawDonation = async () => {
    if (!account) return;
    const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
    const PLATFORM_OWNER = "c5c4804692089498f5020e1c012e58907e881abef82e6230c29f5146346b5559";

    console.log("🚀 ~ handleDonate ~ amount:");
    const transaction: any = {
      data: {
        function: `${MODULE_ADDRESS}::crowdfundings::withdraw_funds`,
        typeArguments: [APTOS_COIN],
        functionArguments: [
          PLATFORM_OWNER, // platform creator
        ],
      },
    };
    console.log("🚀 ~ handleDonate ~ transaction:", transaction);
    try {
      //  const committedTxn = await aptos.signAndSubmitTransaction({ signer: alice, transaction: txn });
      const response = await signAndSubmitTransaction(transaction);
      await aptosClient().waitForTransaction({ transactionHash: response.hash });
      console.log("🚀 ~ handleDonate ~ response:", response);
      toast({
        variant: "default",
        title: "success",
        description: "Transaction successful",
      });
      fetchCampaignDetails(); // Re-fetch after donation is made
      setAmount(0);
      setIsOpen(false);
    } catch (error) {
      console.error("Error donating", error);
    }
  };

  return (
    <div className=" text-white font-sans radiant-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 ">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Media */}
          <div>
            <div className="relative bg-white aspect-video rounded-md overflow-hidden">
              <img
                src={donate} // keep your campaign visual here
                alt="Campaign Visual"
                className="object-cover w-full h-full"
              />
            </div>
            {/* Optional thumbnails */}
            <div className="flex gap-2 mt-2">
              {[donate, donate, donate].map((thumb, i) => (
                <img key={i} src={thumb} alt="thumb" className="w-20 h-14 object-cover rounded-md border" />
              ))}
            </div>
          </div>

          {/* Right: Campaign Info */}
          <div>
            <p className="uppercase text-rosewine font-bold text-sm mb-1">
              {campaign ? "Active Campaign" : "Loading..."}
            </p>
            <h2 className="text-orange-500 text-shadow-md text-2xl font-bold">Campaign Goal</h2>
            <h1 className="text-3xl font-bold">{convertAmountFromOnChainToHumanReadable(goal, APT_DECIMALS)} APT</h1>

            <div className="text-orange-500 text-shadow-md text-2xl font-bold mt-5">
              {" "}
              Campaign Name:
              <span className="uppercase ml-3 text-gray-100 text-shadow-md text-2xl">{name}</span>
            </div>

            {/* Creator info placeholder */}
            <div className="fle items-center gap-2 mt-3">
              <div className="flex ml-">
                <div className="w-8 h-8 bg-rosewine rounded-full mr-3 font-bold" />
                <p className="text-xl text-gray-100">{contributor.length} Contributors </p>
              </div>
              <br />
              <p className="text-xl ">Deadline: {new Date(deadline * 1000).toLocaleDateString()}</p>
            </div>

            {/* Funding Progress */}
            <div className="mt-6">
              <p className="text-xl font-semibold">
                {convertAmountFromOnChainToHumanReadable(funding, APT_DECIMALS)} APT
              </p>
              <p className="text-sm text-gray-100">{contributor?.length} backers</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-rosewine" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                {progress}% of {convertAmountFromOnChainToHumanReadable(goal, APT_DECIMALS)} APT Goal
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="bg-rosewine text-white px-6 py-3 rounded-md font-semibold"
              >
                Donate Now
              </button>
              <button
                onClick={WithdrawDonation}
                type="button"
                className="border bg-teal-700 border-gray-300 px-4 py-3 rounded-xl text-lg font-bold"
              >
                Withdraw
              </button>
              <button disabled={true} type="button" className="border border-gray-300/5  px-4 py-3 rounded-md text-sm">
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs + Story */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Story + Tabs */}
          <div className="lg:col-span-2 ">
            <div className="flex gap-2 border-b pb-2 font-semibold text-sm uppercase">
              <span className="bg-fuchsia px-5 py-3 rounded-xl">Story</span>
              <span className="bg-fuchsia px-5 py-3 rounded-xl">FAQ</span>
              <span className="bg-fuchsia px-5 py-3 rounded-xl border-r">Updates</span>
              <span className="bg-fuchsia px-5 py-3 rounded-xl">Discussion</span>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold text-orange-500 text-shadow-md">The Campaign Description</h2>
              <p className="text-gray-100 mt-2 mb-8">{description}</p>
              <p className="mt-2 text-gray-100">
                We’re inviting you to support this campaign — a vision fueled by passion, creativity, and determination.
                Your contribution will help bring this project to life and make a meaningful impact. Every pledge
                counts, and together we can turn ideas into reality.
              </p>
            </div>
          </div>

          {/* Sidebar perks (optional) */}
          <div className="space-y-6">
            <div className="border rounded-md overflow-hidden">
              <img src={donate} alt="perk" />
              <div className="p-4">
                <h4 className="font-bold text-sm">Special Perk</h4>
                <p className="mt-1 text-rosewine font-bold">Support from {contributor.length} donators</p>
                <p className="text-sm text-gray-500 mt-1">Help bring this campaign to life.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal (keep as is) */}
        <Transition appear show={isOpen} as="div">
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setIsOpen(false)}>
            <div className="min-h-screen px-4 flex items-center justify-center bg-black/50">
              <Dialog.Panel className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
                <Dialog.Title className="text-xl font-bold mb-4 text-indigoDark">Enter Donation Amount</Dialog.Title>
                <input
                  type="number"
                  value={amount}
                  onChange={(e: any) => setAmount(e.target.value)}
                  className="w-full border border-fuchsia/40 px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-fuchsia outline-none"
                  placeholder="Amount in tokens"
                />
                <div className="flex justify-end space-x-3">
                  <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                  <button
                    onClick={handleDonate}
                    className="bg-fuchsia text-white px-4 py-2 rounded-lg hover:bg-violet transition"
                  >
                    Donate
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default CampaignDetailPage;

