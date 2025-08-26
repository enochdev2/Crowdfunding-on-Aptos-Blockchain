
export default function SolanaDashboardLanding() {
  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center px-6">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-lg font-semibold">Portfolio</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Your entire <span className="text-green-400">Solana DeFi</span> world,
            tracked in one <span className="text-green-400">unified dashboard.</span>
          </h1>

          <p className="text-gray-400 text-lg">
            We scan 140+ protocols in real time to track your assets and catch
            every claimable item you might have missed.
          </p>

          <button className="bg-green-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-green-500 transition">
            Connect wallet
          </button>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search address, domain or group"
              className="w-full bg-gray-900 border border-gray-700 rounded-full px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <p className="text-gray-400">
            Or <span className="text-green-400 cursor-pointer">try the demo</span>
          </p>
        </div>

        {/* Right Section - Dashboard Preview */}
        <div className="relative bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-800">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
            <span className="text-sm text-gray-400">Dashboard</span>
            <span className="text-sm text-gray-400">Wallet Manager</span>
          </div>

          {/* Net Worth Card */}
          <div className="bg-black rounded-lg p-4 mb-4 border border-gray-700">
            <h2 className="text-2xl font-bold">$60,416.38</h2>
            <p className="text-green-400">+959.28</p>
            <div className="text-gray-400 text-sm mt-2 space-y-1">
              <p>Claimable: $43,816.19</p>
              <p>JUP Holdings: 31,032.09</p>
              <p>JUP Staked: 86.4%</p>
            </div>
          </div>

          {/* Wallet Breakdown */}
          <div className="bg-black rounded-lg p-4 border border-gray-700 mb-4">
            <h3 className="text-gray-400 text-sm mb-2">Wallet Breakdown</h3>
            <div className="flex space-x-2">
              <div className="w-16 h-2 bg-green-400 rounded"></div>
              <div className="w-16 h-2 bg-blue-400 rounded"></div>
              <div className="w-16 h-2 bg-purple-400 rounded"></div>
              <div className="w-16 h-2 bg-yellow-400 rounded"></div>
            </div>
          </div>

          {/* Tokens Table */}
          <div className="bg-black rounded-lg p-4 border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Personal Wallet</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left">Token</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Price</th>
                  <th className="text-left">Value</th>
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="border-t border-gray-700">
                  <td className="py-2">SOL</td>
                  <td>120.87</td>
                  <td>$142.61</td>
                  <td>$16,251.89</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="py-2">JUP</td>
                  <td>3,909.09</td>
                  <td>$0.55</td>
                  <td>$2,152.93</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="py-2">PENGU</td>
                  <td>175,714.28</td>
                  <td>$0.007</td>
                  <td>$1,136.30</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="py-2">TRUMP</td>
                  <td>37.19</td>
                  <td>$11.56</td>
                  <td>$432.51</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mascot Placeholder */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">Mascot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
