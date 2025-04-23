"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getSolPrice } from "../SolToUsd"; // Adjust the import path to your actual file
import { useNavigate } from "react-router-dom";
interface NotificationBannerProps {
  tokenName: string;
  marketCap: string | number; // Accept both string and number
  tradeType?: "bought" | "sold";
  amount?: string;
}

const jerkyAnimation = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    x: [0, -15, 15, -10, 10, -5, 5, 0], // Hard left-right jerk
    y: [0, -10, 10, -5, 5, -3, 3, 0], // Hard up-down jerk
    transition: {
      duration: 0.6,
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1],
      ease: "easeInOut",
    },
  },
  exit: { opacity: 0, y: -20 },
};

// Function to format amount to 4 decimal places
const formatAmount = (amount: string): string => {
  const [value, unit] = amount.split(" ");
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return amount;
  return `${numValue.toFixed(4)} ${unit}`;
};

// Function to parse market cap (handles both string and number)
const parseMarketCap = (marketCap: string | number): number => {
  if (typeof marketCap === "number") {
    return marketCap; // Assume number is the base value (e.g., 29.24646K SOL)
  }
  if (typeof marketCap !== "string" || !marketCap) {
    console.warn("marketCap is not a valid string or number:", marketCap);
    return 0;
  }
  const cleaned = marketCap.replace("$", "").toLowerCase();
  const value = parseFloat(cleaned.replace(/[km]/, ""));
  return isNaN(value) ? 0 : value; // Returns base value (e.g., 8.9 for "$8.9k")
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  tokenName,
  marketCap,
  tradeType,
  amount,
}) => {
  const [solPrice, setSolPrice] = useState<number>(0);

  // Fetch SOL price on component mount
  const navigate = useNavigate();
  // Fetch SOL price on component mount
  useEffect(() => {
    const fetchPrice = async () => {
      const fetchedPrice = localStorage.getItem('sol-price');
      console.log("fetchedPricd: ", fetchedPrice);

      // const fetchedPrice = await getSolPrice();
      // console.log("fetched price: ", fetchedPrice);
      // setSolPrice(fetchedPrice);

    };
    fetchPrice();
  }, [navigate]);

  // Log props for debugging
  // console.log("NotificationBanner props:", {
  //   tokenName,
  //   marketCap,
  //   tradeType,
  //   amount,
  //   solPrice,
  // });

  const displayAmount = amount ? formatAmount(amount) : undefined;

  // Calculate adjusted market cap
  const parsedMarketCap = parseMarketCap(marketCap); // e.g., 29.24646 or "$8.9k" -> 8.9
  const effectivePrice = solPrice > 0 ? solPrice : 1; // Fallback to 1 if solPrice not fetched
  const adjustedMarketCap = ((parsedMarketCap * effectivePrice) / 1000).toFixed(
    4
  );
  const displayMarketCap = `$${adjustedMarketCap}K`;

  return (
    <motion.div
      variants={jerkyAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      key={`${tradeType}-${amount}`} // Trigger animation on new trade
      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm text-white py-2 px-3 rounded-lg border border-purple-500/40 shadow-lg shadow-purple-500/10"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="font-semibold text-xs text-purple-100">Trade:</span>
          <span className="text-xs">
            {tradeType && displayAmount ? (
              <>
                <span className="font-medium text-purple-200">
                  {tradeType === "bought" ? "Bought" : "Sold"}
                </span>{" "}
                {displayAmount} of {tokenName}
              </>
            ) : (
              `Awaiting trade for ${tokenName}`
            )}
          </span>
        </div>
        <span className="text-xs bg-purple-500/30 text-purple-100 px-1.5 py-0.5 rounded-full">
          MC: {displayMarketCap}
        </span>
      </div>
    </motion.div>
  );
};

export default NotificationBanner;
