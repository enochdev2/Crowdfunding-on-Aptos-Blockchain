// Internal Components
import { Header } from "@/components/Header";
import { Stake } from "./pages/Stake";
import { TopBanner } from "./components/TopBanner";
import { IS_DEV } from "./constants";
import CampaignPage from "./pages/Stake/CampaignPage";
import DonatePage from "./pages/Stake/DonatePage";
import RefundPage from "./pages/Stake/RefundPage";
import AdminPage from "./pages/Stake/AdminPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Hero from "./components/Hero";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      {/* <Header />
      <Stake /> */}
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Stake />} />
          <Route path="/campaign" element={<CampaignPage />} />
          <Route path="/campaign" element={<CampaignPage />} />
          {/* <Route path="/donate" element={<DonatePage />} /> */}
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
