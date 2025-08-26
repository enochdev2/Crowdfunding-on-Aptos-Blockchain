import logo from "../assets/crowdfunding.png";

function Apps() {
  return (
    <div className=" bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white p-6 md:px-16 z-10">
      <div className=" m-auto max-w-7xl">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-bold">A  Strategy Built for Security</h1>
        </div>
        <div className="space-x-4 flex items-center">
          <a href="/security-audits" className="text-blue-400 hover:text-blue-500">View security Audits</a>
          <a href="https://github.com/enochdev2"  className="text-blue-400 hover:text-blue-500">Github</a>
        </div>
      </div>

      {/* Security Verification */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg">
          Our open-source code is rigorously reviewed by leading security firms. Verified by:
        </p>
        <div className="flex space-x-4">
          <img src={logo} alt="Neodyme" className="w-8 h-8" />
          <img src={logo} alt="OtterSec" className="w-8 h-8" />
          <img src={logo} alt="Sec3" className="w-8 h-8" />
        </div>
      </div>

      {/* Information Sections */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800/30 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Sanctum's Infinity: The Ultimate Guide</h2>
          <p className="mt-2 text-gray-400">How Sanctum's Infinity works, why it matters and how to use it.</p>
          <a href="/guide" className="text-blue-400 hover:text-blue-500 mt-4 inline-block">Learn more</a>
        </div>

        <div className="bg-gray-800/30 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Why is Infinity the Best Strategy to Stake Solana?</h2>
          <p className="mt-2 text-gray-400">What makes Infinity the premier Solana staking strategy.</p>
          <a href="/stake-solana" className="text-blue-400 hover:text-blue-500 mt-4 inline-block">Learn more</a>
        </div>
      </div>

      </div>
    </div>
  );
}

export default Apps;
