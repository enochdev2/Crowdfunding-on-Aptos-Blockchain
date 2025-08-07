import { useState } from "react";

// DonatePage.tsx
const DonatePage = () => {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleDonate = async () => {
    setStatus("Processing...");
    try {
      // call donate<CoinType> via Move SDK or wallet provider
      // await donate(account, amount)
      setStatus("Donation successful!");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <section className="max-w-lg mx-auto py-16 px-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Donate to InnoFi</h2>
      <input
        type="number"
        placeholder="Enter amount"
        className="w-full p-3 border rounded mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handleDonate}
        className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-secondary"
      >
        Donate
      </button>
      <p className="mt-4 text-sm text-gray-700">{status}</p>
    </section>
  );
};

export default DonatePage;
