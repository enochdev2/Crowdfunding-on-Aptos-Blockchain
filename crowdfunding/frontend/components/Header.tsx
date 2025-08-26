import { WalletSelector } from "./WalletSelector";
// import { useGetTokenData } from "@/hooks/useGetTokenData";
import { NavLink, Link } from "react-router-dom";

export function Header() {

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Campaign", path: "/campaign" },
    // { name: "Refund", path: "/refund" },
    // { name: "Admin", path: "/admin" }, // optionally re-enable
  ];

  return (
    <nav className="bg-gray-900 text-white p-4 px-2 md:py-5 md:px-36 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand left */}
        <Link
          to="/"
          className=" flex gap-1  items-center text-[20px] md:text-[26px] text-shadow-sm font-extrabold bg-gradient-to-r from-rosewine via-fuchsia to-violet text-transparent bg-clip-text hover:opacity-90 transition drop-shadow-sm"
        >

          <img src="/aptos.png" alt=""  className="w-5 h-5 md:w-8 md:h-8 bg-gray-50 rounded-full"  />
          RaiseFi
        </Link>

        {/* Center Nav */}
        <div className="flex text-sm md:text-base space-x-2 md:space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `transition font-medium ${
                  isActive ? "text-fuchsia border-b-2 border-fuchsia" : "text-white hover:text-fuchsia"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Wallet Selector right */}
        <div>
          <WalletSelector />
        </div>
      </div>
    </nav>
  );
}
