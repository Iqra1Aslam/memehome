import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Lightbulb, Sparkles, Menu, X } from "lucide-react";
import {
  WalletMultiButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import "@solana/wallet-adapter-react-ui/styles.css";
import "../WalletModalStyles.css";

const URL = import.meta.env.VITE_API_URL;

interface NavbarProps {
  onLaunchClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLaunchClick }) => {
  const { connected, publicKey, signMessage } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to handle wallet connection and POST request
  const connectWalletToBackend = async () => {
    if (!publicKey) {
      console.error("No public key available.");
      return;
    }

    const walletAddress = publicKey.toBase58();
    const name = walletAddress.slice(0, 6); // First 6 characters of wallet address

    try {
      const response = await fetch(`${URL}user/connect-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `@${name}`, // Adding @ prefix as per backend logic
          wallet: walletAddress, // Full wallet address
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Wallet connected successfully:", data.user);
      } else {
        console.error("Wallet connection failed:", data.msg);
      }
    } catch (error) {
      console.error("Error connecting wallet to backend:", error);
    }
  };

  useEffect(() => {
    if (connected) {
      connectWalletToBackend(); // Trigger POST request as soon as wallet is connected
    }
  }, [connected, publicKey]); // Runs whenever connected or publicKey changes

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-black/10 backdrop-blur-lg z-50 px-4 py-2 border-b border-purple-500/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Rocket className="w-6 h-6 text-purple-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            MemeHome
          </span>
        </motion.div>

        <ul className="hidden md:flex items-center space-x-6">
          <li>
            <a
              href="https://working.memehome.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-300 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500"
            >
              <Lightbulb size={16} />
              <span>How it works</span>
            </a>
          </li>
          <NavItem
            icon={<Sparkles size={16} />}
            text="Launch"
            onClick={onLaunchClick}
          />
        </ul>

        <div className="hidden md:block">
          <WalletModalProvider>
            <WalletMultiButton
              className="wallet-multi-button"
              style={{
                background:
                  "linear-gradient(to right, #8b5cf6, #ec4899, #6366f1)",
                color: "white",
                fontWeight: 600,
                borderRadius: "9px",
                padding: "0.01rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                boxShadow:
                  "0 4px 6px -1px rgba(139, 92, 246, 0.2), 0 2px 4px -1px rgba(139, 92, 246, 0.12)",
                transition: "background 0.3s ease-in-out",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              {connected ? (
                <span>{publicKey?.toBase58().slice(0, 6)}...</span>
              ) : (
                "Connect Wallet"
              )}
            </WalletMultiButton>
          </WalletModalProvider>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleMobileMenu}
            className="text-purple-500 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-14 right-4 bg-black/90 backdrop-blur-lg rounded-lg shadow-lg p-3"
          >
            <ul className="flex flex-col space-y-3">
              <li>
                <a
                  href="https://working.memehome.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-300 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Lightbulb size={16} />
                  <span>How it works</span>
                </a>
              </li>
              <NavItem
                icon={<Sparkles size={16} />}
                text="Launch"
                onClick={() => {
                  onLaunchClick();
                  setIsMobileMenuOpen(false);
                }}
              />
            </ul>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}> = ({ icon, text, onClick }) => (
  <li
    onClick={onClick}
    className="flex items-center space-x-1 cursor-pointer text-gray-300 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500"
  >
    {icon}
    <span>{text}</span>
  </li>
);

export default Navbar;