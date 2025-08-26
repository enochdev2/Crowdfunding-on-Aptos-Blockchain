// Internal Components
import { Header } from "@/components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Apps from "./components/Sect";
import { Stake } from "./pages/Stake";
import CampaignDetailPage from "./pages/Stake/CampaignDetailPage";
import CampaignPage from "./pages/Stake/CampaignPage";
import RefundPage from "./pages/Stake/RefundPage";

function App() {
  return (
    <div className="overflow-x-hidden">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Stake />} />
          <Route path="/campaign" element={<CampaignPage />} />
          <Route path="/campaign/:creator" element={<CampaignDetailPage />} />
          <Route path="/refund" element={<RefundPage />} />
        </Routes>
       <section className="relative">
        <div className=" bottom-0">
          <Apps />
          <Footer />
        </div>
      </section>
      </BrowserRouter>
    </div>
  );
}

export default App;
