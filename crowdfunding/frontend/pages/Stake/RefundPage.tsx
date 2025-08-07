import { Dialog } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import logo from "../../assets/crowdfunding.png"
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { MODULE_ADDRESS } from "../../constants";
import { aptosClient } from "../../utils/aptosClient";

// RefundPage.tsx
const RefundPage = () => {
  const [status, setStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
   const { toast } = useToast();
      const { account, signAndSubmitTransaction } = useWallet();

  const handleRefund = async () => {
    setStatus("Processing refund...");
    setIsOpen(true); // Show modal while processing refund
      const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
        if (!account) return;

        const amount = 100000000
    
        const transaction: any = {
            data: {
              function: `${MODULE_ADDRESS}::crowdfundings::withdraw_funds`,
              typeArguments: [APTOS_COIN],
              functionArguments: [ amount ],
            },
          };
        console.log("🚀 ~ handleClaim ~ transaction:", transaction)
        setStatus("Claiming funds...");
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
              setStatus("Funds claimed successfully.");
            } catch (err) {
              console.error("Error donating", err);
              setStatus("Error: " + err);
            }
            setIsOpen(false); // Close modal after refund process
  };

  return (
    <section className="relative bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white h-[80vh] flex items-center justify-center">
          <img
            src={logo}
            alt="Hero"
            className="absolute inset-0 w-full h-[95%] object-cover opacity-30 mix-blend-overlay"
          />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm z-0" />
      <div className="relative z-10 max-w-md mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-6">Claim Refund</h2>
        <button
          onClick={handleRefund}
          className="bg-white text-rosewine font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-white/80 transition w-full"
        >
          Get Refund
        </button>
        <p className="mt-4 text-sm text-white/80 text-center">{status}</p>
      </div>

      {/* Modal for processing state */}
      <Transition appear show={isOpen} as="div">
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setIsOpen(false)}>
          <div className="min-h-screen px-4 flex items-center justify-center bg-black/50">
            <Dialog.Panel className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
              <Dialog.Title className="text-xl font-bold mb-4 text-indigoDark">
                Processing Refund...
              </Dialog.Title>
              <div className="flex justify-center items-center space-x-3">
                <div className="animate-spin border-4 border-t-4 border-fuchsia rounded-full w-12 h-12"></div>
                <p className="text-lg font-semibold">Please wait...</p>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
};

export default RefundPage;
