"use client";

import type React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface NavigationHeaderProps {
  onBack: () => void;
  tokenName: string;
  tokenSymbol: string;
  marketCap: number;
  price?: number | null; // Optional price prop
}


const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  onBack,
  tokenName,
  tokenSymbol,
  marketCap,
  price,
}) => {
  // Use provided price if available, otherwise fallback to 164.91
  const effectivePrice = price ?? 164.91;
  console.log("price from navigation: ", price);
  console.log("effectivePrice: ", effectivePrice);

  // Calculate formatted market cap
  const formattedMarketCap = `$${((marketCap * effectivePrice) / 1000).toFixed(
    2
  )}K`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10"
        >
          <ArrowLeft size={18} />
          <span>go back</span>
        </motion.button>

        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium">{tokenName}</span>
          <div className="px-2 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-md text-xs text-purple-300 font-semibold border border-purple-500/30">
            {tokenSymbol}
          </div>
        </div>
        <span className="text-gray-400 text-sm">about 10 hours ago</span>
      </div>

      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">market cap:</span>
          <span className="text-green-400 font-semibold">
            {formattedMarketCap}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">replies:</span>
          <span className="text-white font-semibold">382</span>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader;
