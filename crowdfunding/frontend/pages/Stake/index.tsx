import Hero from "@/components/Hero";
import Sections from "@/components/Sections";
import CampaignPage from "./CampaignPage";

export const Stake: React.FC = () => {

  return (
    <div style={{ overflow: "hidden" }} className="overflow-hidden">
      <main className="flex flex-col  ">
        <Hero/>
        <Sections/>
        <CampaignPage />
      </main>
    </div>
  );
};
