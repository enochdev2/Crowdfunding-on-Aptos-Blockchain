import { aptosClient } from "@/utils/aptosClient";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/crowdfunding.png";
import LoadingSpinner from "./LoadingSpinner";

// const NODE_URL = "https://api.testnet.aptoslabs.com/v1"; // Aptos testnet
const MODULE_ADDRESS = "0x237ec9a80e993f561e4cde1f4fdcd9df1aadd7a826cdcda2fce83a44cea493e5"; // your module address
const APT_DECIMALS = 1e8;

interface Campaign {
  name: string;
  description: string;
  creator: string;
  crowdfund_type: number;
  goal_amount: number;
  deadline: number;
  current_amount: number;
  active: boolean;
  is_successful: boolean;
}

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    const address = "c5c4804692089498f5020e1c012e58907e881abef82e6230c29f5146346b5559";
    try {
      const crowdfundingResource = await aptosClient().getAccountResource({
        accountAddress: address,
        resourceType: `${MODULE_ADDRESS}::crowdfundings::CrowdfundingPlatform`,
      });
      console.log("🚀 ~ fetchList ~ crowdfundingResource:", crowdfundingResource);

      const tableHandle = (crowdfundingResource as any).campaigns.handle;
      const crowdfunds = (crowdfundingResource as any).crowdfunds;
      // fetch each campaign
      const campaigns = await Promise.all(
        crowdfunds.map(async (id: string) => {
          const item = await aptosClient().getTableItem({
            handle: tableHandle,
            data: {
              key_type: "address",
              value_type: `${MODULE_ADDRESS}::crowdfundings::Campaign`,
              key: id,
            },
          });
          //@ts-ignore
          return { id, ...item };
        }),
      );

      console.log("✅ campaigns:", campaigns);
      setCampaigns(campaigns);
      setLoading(false);
      return campaigns;
    } catch (e) {
      console.error("❌ Error fetching campaigns:", e);
    }
  };


if (loading) {
  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white">
      {/* Background gradient pulse */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute w-64 h-64 bg-fuchsia rounded-full mix-blend-screen filter blur-3xl opacity-30"
        animate={{ x: [0, 100, -100, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-rosewine rounded-full mix-blend-screen filter blur-3xl opacity-20"
        animate={{ x: [50, -100, 100, 50], y: [0, 60, -60, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo pulse */}
      <motion.img
        src={logo}
        alt="Logo"
        className="w-28 h-28 z-10 mix-blend-screen"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Loading Text */}
      <motion.p
        className="absolute bottom-16 text-lg tracking-widest font-bold text-white drop-shadow-lg"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading Campaigns...
      </motion.p>
    </div>
  );
}
if (loading) {
    return <LoadingSpinner/>
  }

  if (campaigns.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No campaigns found</p>;
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white ">
      <img
        src={logo}
        alt="Hero"
        className="absolute inset-0 w-full h-[95%] object-cover opacity-30 mix-blend-overlay"
      />
      <div className=" absolute w-full bg-black/30 h-full"></div>
      <div className="max-w-full mx-auto px-6 py-6 relative z-10">
        <h2 className=" bg-blac py-3 text-4xl font-extrabold text-center text-[#f3c0c0]  drop-shadow-lg">
          Popular <span className="text-[#7a81d8] text-shadow-sm">Campaigns</span>
        </h2>
        <section className="flex flex-wrap gap-6 p-6">
          {campaigns.map((c, i) => (
            <div
              key={i}
              className="w-[330px] rounded-xl bg-gradient-to-r from-rosewine via-fuchsia to-violet shadow-xl hover:scale-[1.015] transition-transform duration-300 text-white p-5 border border-slate-400 "
            >
              <div className="h-28">
                <img src={logo} alt="logo" className="h-28 w-full" />
              </div>
              <h2 className="text-xl font-extrabold text-orange-400  text-shadow-md">{c.name}</h2>
              <p className="text-gray-100 text-sm mt-2">{c.description?.slice(0, 50)}</p>

              <div className="mt-3">
                <p className="text-base text-orange-100">
                  <span className="font-semibold text-orange-400">Creator:</span> {c.creator.slice(0, 8)}...
                </p>
                <p className="text-lg text-orange-100">
                  <span className="font-semibold text-orange-400 text-base">Goal:</span> {c.goal_amount / APT_DECIMALS}{" "}
                  APT
                </p>
                {/* <p className="text-base text-orange-100">
                  <span className="font-semibold text-orange-400">Raised:</span> {c.current_amount / APT_DECIMALS} APT
                </p> */}
                <p className="text-base text-orange-100">
                  <span className="font-semibold text-orange-400">Deadline:</span>{" "}
                  {new Date(c.deadline * 1000).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                {c.active ? (
                  <span className="px-3 py-1 text-base bg-green-100 text-green-700 rounded-full">Active</span>
                ) : (
                  <span className="px-3 py-1 text-lg bg-red-100 text-red-700 rounded-full">Closed</span>
                )}

                {/* ✅ View Button */}
                <Link to={`/campaign/${c.creator}`}>
                  <button className="px-5 py-1 text-lg bg-purple-900 text-white font-bold hover:bg-indigo-700 transition border border-slate-300 rounded-xl">
                    View
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}
