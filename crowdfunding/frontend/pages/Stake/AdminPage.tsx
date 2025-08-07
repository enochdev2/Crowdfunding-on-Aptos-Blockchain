import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { MODULE_ADDRESS } from "../../constants";
import { aptosClient } from "../../utils/aptosClient";

// AdminPage.tsx
const AdminPage = () => {
  const [status, setStatus] = useState("");
  const { toast } = useToast();
    const { account, signAndSubmitTransaction } = useWallet();

  const handleClaim = async () => {
    const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
    if (!account) return;

    const transaction: any = {
        data: {
          function: `${MODULE_ADDRESS}::crowdfundings::withdraw_funds`,
          typeArguments: [APTOS_COIN],
          functionArguments: [ 10 ],
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
          setStatus("Error: " + err.message);
        }
  };

  return (
    <section className="max-w-md mx-auto py-16 px-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Admin: Claim Funds</h2>
      <button
        onClick={handleClaim}
        className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-secondary"
      >
        Claim Funds
      </button>
      <p className="mt-4 text-sm text-gray-700">{status}</p>
    </section>
  );
};

export default AdminPage;
