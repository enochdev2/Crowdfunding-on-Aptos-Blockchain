import { WalletSelector } from "./WalletSelector";
// import { useGetTokenData } from "@/hooks/useGetTokenData";
import { NavLink, Link } from "react-router-dom";

export function Header() {

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Campaign", path: "/campaign" },
    { name: "Refund", path: "/refund" },
    // { name: "Admin", path: "/admin" }, // optionally re-enable
  ];

  return (
    <nav className="bg-gray-900 text-white p-4 md:py-5 md:px-36 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand left */}
        <Link
          to="/"
          className="text-3xl text-shadow-sm font-extrabold bg-gradient-to-r from-rosewine via-fuchsia to-violet text-transparent bg-clip-text hover:opacity-90 transition drop-shadow-sm"
        >
          RaiseFi
        </Link>

        {/* Center Nav */}
        <div className="flex space-x-6">
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
