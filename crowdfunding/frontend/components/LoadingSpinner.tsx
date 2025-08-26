import { motion } from "framer-motion";
import logo from "../assets/crowdfunding.png";


const LoadingSpinner = () => {

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark text-white">
      {/* Background gradient pulse */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-rosewine via-fuchsia to-indigoDark"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute w-64 h-64 bg-fuchsia rounded-full mix-blend-screen filter blur-3xl opacity-30"
        animate={{ x: [0, 100, -100, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-rosewine rounded-full mix-blend-screen filter blur-3xl opacity-20"
        animate={{ x: [50, -100, 100, 50], y: [0, 60, -60, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo pulse */}
      <motion.img
        src={logo}
        alt="Logo"
        className="w-28 h-28 z-10 mix-blend-screen"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Loading Text */}
      <motion.p
        className="absolute bottom-16 text-lg tracking-widest font-bold text-white drop-shadow-lg"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading Campaigns...
      </motion.p>
    </div>
  );

}

export default LoadingSpinner
