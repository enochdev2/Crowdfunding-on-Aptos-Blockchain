
export default function IntegrationsSection() {
  return (
    <div className=" bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white px-12 py-16 min-h-[90%] ">
      <div className="flex flex-wrap max-w-7xl mx-auto space-x-12 space-y-12 md:space-x-36">
        {/* Left Side */}
        <div className="flex-1 pr-10">
          <p className="text-purple-200 text-3xl mb-3 from-rosewine via-fuchsia to-indigoDark bg-clip-text text-transparent text-shadow-white">
            Successful Campaigns
          </p>
          <h2 className="text-4xl font-bold mb-4 text-shadow-md text-orange-500">Over 15+ Crowdfunding Campaigns</h2>
          <p className="text-gray-400 text-lg font-semibold text-shadow-md">
            With integrations across top platforms and services, our crowdfunding hub gives you more ways to launch,
            support, and maximize campaign success.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1 space-y-8">
          {/* Borrow/Lend */}
          <div>
            <h3 className="font-semibold text-lg">Invest in new Campaign</h3>
            <p className="text-gray-200 text-base mb-2 text-shadow-md">
              Use your campaign assets as collateral to borrow or lend funds securely.
            </p>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-rosewine via-fuchsia to-violet rounded border" />
              <div className="w-8 h-8 bg-gradient-to-r from-rosewine via-fuchsia to-violet rounded border" />
              <div className="w-8 h-8 bg-gradient-to-r from-rosewine via-fuchsia to-violet rounded border" />
            </div>
          </div>

          {/* Trading */}
          <div>
            <h3 className="font-semibold text-lg ">Trading</h3>
            <p className="text-gray-200 text-sm mb-2  text-shadow-md">Trade campaign tokens on top-tier exchanges.</p>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-rosewine via-fuchsia to-violet rounded border" />
              <div className="w-8 h-8 bg-gradient-to-r from-rosewine via-fuchsia to-violet rounded border" />
            </div>
          </div>

          {/* Provide Liquidity */}
          <div>
            <h3 className="font-semibold text-lg">Provide Liquidity</h3>
            <p className="text-gray-200 text-sm mb-2  text-shadow-md">Earn rewards by supplying liquidity to decentralized pools.</p>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-rosewine via-fuchsia to-violet rounded border" />
              <div className="w-8 h-8 bg-gradient-to-r from-rosewine via-fuchsia to-violet rounded border" />
              <div className="w-8 h-8 bg-gradient-to-r from-rosewine via-fuchsia to-violet rounded border" />
              <div className="w-8 h-8 bg-gradient-to-r from-rosewine via-fuchsia to-violet rounded border" />
            </div>
          </div>

          {/* Vaults */}
          <div>
            <h3 className="font-semibold text-lg">Vaults</h3>
            <p className="text-gray-400 text-sm mb-2">Earn yield by putting campaign funds to work safely.</p>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-700 rounded" />
              <div className="w-8 h-8 bg-gray-700 rounded" />
            </div>
          </div>

          {/* Leveraged Staking */}
          {/* <div>
          <h3 className="font-semibold text-lg">Leveraged Staking</h3>
          <p className="text-gray-400 text-sm mb-2">
            Multiply your rewards by staking campaign tokens with leverage.
          </p>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-700 rounded" />
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
}
