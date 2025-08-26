import { Socials } from "@/pages/Stake/components/Socials";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-rosewine via-fuchsia to-indigoDark text-white py-12 z-100 ">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {/* Column 1: Brand */}
        <div className="space-y-3">
          <Link
            to="/"
            className="text-4xl  text-shadow-white font-extrabold bg-gradient-to-r from-rosewine via-fuchsia to-violet text-transparent bg-clip-text hover:opacity-90 transition drop-shadow-sm"
          >
            RaiseFi
          </Link>
          <p className="text-md text-white">Decentralized crowdfunding for DeWorld innovators. Fund. Vote. Empower.</p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-white/90 text-sm">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/campaign" className="hover:underline">
                Campaign
              </a>
            </li>
            <li>
              <a href="/refund" className="hover:underline">
                Claim Refund
              </a>
            </li>
            <li>
              <a href="/admin" className="hover:underline">
                Admin Portal
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Stay Connected */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
          <p className="text-sm text-white/80 mb-4">Join our community and shape the future.</p>

          <Socials />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-white/10 pt-6 text-center text-white/70 text-sm">
        &copy; {new Date().getFullYear()} InnoFi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
