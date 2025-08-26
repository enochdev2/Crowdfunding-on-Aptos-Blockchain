import CampaignList from "@/components/AllCampaign";
import CrowdfundLanding from "@/components/Heroo";
import Sections from "@/components/Sections";

const CampaignPage = () => {
  return (
    <section className="relative bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white  ">
      <div>
        <CrowdfundLanding />
      </div>
      <div className="min-h-[100vh]">
        <CampaignList />
      </div>
      <div className="hidden md:block">
        <Sections />
      </div>
      {/*  */}
    </section>
  );
};

export default CampaignPage;
