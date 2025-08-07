import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import logo from "../../assets/crowdfunding.png";
import donate from "../../assets/donate.png";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "../../constants";
import { aptosClient } from "../../utils/aptosClient";
import { useToast } from "@/components/ui/use-toast";

const CampaignPage = () => {
 const { toast } = useToast();
  const { account, signAndSubmitTransaction } = useWallet();
  const [goal, setGoal] = useState<number>(1000);
  const [funding, setFunding] = useState<number>(550);
  const [deadline, setDeadline] = useState<number>(Date.now() + 60 * 60 * 1000);
  const [donors, setDonors] = useState<string[]>(["0x1", "0x2"]);
  const [amount, setAmount] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const [accountHasList, setAccountHasList] = useState<boolean>(false);

  const progress = Math.min((funding / goal) * 100, 100);

  const handleDonates = () => {
    const amt = parseFloat(amount);
    if (amt > 0) {
      setFunding(funding + amt);
      setDonors([...donors, "0xNewDonor"]);
    }
    setAmount("");
    setIsOpen(false);
  };

  const fetchList = async () => {
    if (!account) return;
    const address = '0xc5c4804692089498f5020e1c012e58907e881abef82e6230c29f5146346b5559';
    try {
      const crowdfundingResource = await aptosClient().getAccountResource({
        accountAddress: address,
        resourceType: `${MODULE_ADDRESS}::crowdfundings::CrowdfundingPlatform`,
      });
      setAccountHasList(crowdfundingResource != null);
    } catch (e) {
      setAccountHasList(false);
    }
  };

  const handleDonate = async () => {
    const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
    if (!account) return;
    console.log("🚀 ~ handleDonate ~ amount:",)
    const transaction: any = {
      data: {
        function: `${MODULE_ADDRESS}::crowdfundings::contribute`,
        typeArguments: [APTOS_COIN],
        functionArguments: ["0xc5c4804692089498f5020e1c012e58907e881abef82e6230c29f5146346b5559", amount ],
      },
    };
    console.log("🚀 ~ handleDonate ~ transaction:", transaction)
    try {
      //  const committedTxn = await aptos.signAndSubmitTransaction({ signer: alice, transaction: txn });
      const response = await signAndSubmitTransaction(transaction);
      await aptosClient().waitForTransaction({ transactionHash: response.hash });
      console.log("🚀 ~ handleDonate ~ response:", response)
      toast({
        variant: "default",
          title: "success",
          description: "Transaction successful",
      })
      fetchList(); // Re-fetch after donation is made
    } catch (error) {
      console.error("Error donating", error);
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white h-[80vh] flex items-center justify-center">
      <img
        src={logo}
        alt="Hero"
        className="absolute inset-0 w-full h-[95%] object-cover opacity-30 mix-blend-overlay"
      />

      <div className="absolute inset-0  backdrop-blur-sm z-0" />
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Campaign Details */}
        <div>
          <h1 className="text-4xl font-extrabold drop-shadow-sm">RaiseFi Campaign</h1>
          <p className="mt-4 text-white/80 text-lg">
            Back DeWorld innovations by funding verified projects. Support now and be part of the future.
          </p>

          <div className="mt-6 space-y-4 bg-black/40 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/10">
            <div className="w-full bg-white/20 h-4 rounded-full">
              <div className="bg-white h-4 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-white/90">
              <strong>{funding}</strong> / {goal} tokens funded
            </p>
            <p className="text-sm text-white/90">
              <strong>Donors:</strong> {donors.length}
            </p>
            <p className="text-sm text-white/90">
              <strong>Time left:</strong> {Math.max(0, Math.floor((deadline - Date.now()) / 1000 / 60))} mins
            </p>

            <button
              onClick={() => setIsOpen(true)}
              className="mt-4 bg-white text-rosewine font-semibold px-6 py-3 rounded-lg shadow hover:bg-white/80 transition"
            >
              Donate Now
            </button>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="relative">
          <img
            src={donate}
            alt="Innovation"
            className="w-full h-[300px] object-cover rounded-xl shadow-xl ring-2 ring-white/10"
          />
        </div>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as="div">
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setIsOpen(false)}>
          <div className="min-h-screen px-4 flex items-center justify-center bg-black/50">
            <Dialog.Panel className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
              <Dialog.Title className="text-xl font-bold mb-4 text-indigoDark">Enter Donation Amount</Dialog.Title>
              <input
                type="number"
                value={amount}
                onChange={(e:any) => setAmount(e.target.value)}
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
    </section>
  );
};

export default CampaignPage;
