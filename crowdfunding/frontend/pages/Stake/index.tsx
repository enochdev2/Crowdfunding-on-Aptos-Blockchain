import CampaignList from "@/components/AllCampaign";
import Hero from "@/components/Hero";
import IntegrationsSection from "@/components/IntegrationsSection";

export const Stake: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <main className="flex flex-col  ">
        <Hero />
        <IntegrationsSection />
        <CampaignList />
      </main>
    </div>
  );
};
