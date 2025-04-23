// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { ArrowLeft } from "lucide-react";
// import { getSolPrice } from "../SolToUsd"; // Adjust the import path as needed
// import { useNavigate } from "react-router-dom";


// interface NavigationHeaderProps {
//   onBack: () => void;
//   tokenName: string;
//   tokenSymbol: string;
//   marketCap: number;
//   price?: number | null; // Still keeping this as an optional override
// }

// const NavigationHeader: React.FC<NavigationHeaderProps> = ({
//   onBack,
//   tokenName,
//   tokenSymbol,
//   marketCap,
//   price: propPrice, // Renamed to avoid conflict with state variable
// }) => {
//   const [solPrice, setSolPrice] = useState<number | null>(null);
//   const navigate = useNavigate();
//   // Fetch SOL price on component mount
//   useEffect(() => {
//     const fetchPrice = async () => {
//       // const fetchedPrice = await getSolPrice();
//       const fetchedPrice = localStorage.getItem('sol-price');
//       console.log("fetchedPricd: ", fetchedPrice);
//     };
//     fetchPrice()
//   }, [navigate])

//   // Use provided price if available, otherwise use fetched SOL price, with fallback to 164.91
//   const effectivePrice = propPrice ?? solPrice ?? 164.91;
//   const formattedMarketCap = `$${((marketCap * effectivePrice) / 1000).toFixed(
//     2
//   )}K`;

//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//       <div className="flex flex-wrap items-center gap-4">
//         <motion.button
//           onClick={onBack}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10"
//         >
//           <ArrowLeft size={18} />
//           <span>go back</span>
//         </motion.button>

//         <div className="flex items-center space-x-2">
//           <span className="text-lg font-medium">{tokenName}</span>
//           <div className="px-2 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-md text-xs text-purple-300 font-semibold border border-purple-500/30">
//             {tokenSymbol}
//           </div>
//         </div>
//         <span className="text-gray-400 text-sm">about 10 hours ago</span>
//       </div>

//       <div className="flex items-center space-x-4 text-sm">
//         <div className="flex items-center space-x-2">
//           <span className="text-gray-400">market cap:</span>
//           <span className="text-green-400 font-semibold">
//             {formattedMarketCap}
//           </span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <span className="text-gray-400">replies:</span>
//           <span className="text-white font-semibold">382</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NavigationHeader;

 
"use client";
 
import type React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { ably } from "./ablyClient";
import { useState,useEffect } from "react";
import CoinCard from "../CoinCard";
interface NavigationHeaderProps {
  onBack: () => void;
  tokenName: string;
  tokenSymbol: string;
  marketCap: number;
  token: string;
  price?: number | null; // Optional price prop
}
 
const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  onBack,
  tokenName,
  tokenSymbol,
  marketCap,
  token,
  price,
}) => {
  // Use provided price if available, otherwise fallback to 164.91
  const effectivePrice = price ?? 164.91;
  console.log("price from navigation: ", price);
  console.log("effectivePrice: ", effectivePrice);
   const URL = process.env.VITE_API_URL || "http://localhost:8000/";
    const [replyCount, setReplyCount] = useState<number>(0);
     console.log("token",token);
  useEffect(() => {
    const fetchReplyCount = async () => {
      try {
        console.log(token);
        const response = await axios.get(`${URL}coin/reply-count/${token}`);
        setReplyCount(response.data.replyCount);  
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching reply count:', error);
      }
    };

    fetchReplyCount();
    const channel = ably.channels.get(`reply-count-${token}`);

    channel.subscribe('reply-count', (message) => {
    
        
        setReplyCount(message.data.replyCount);
    //   }
    });
    return () => {
      channel.unsubscribe(); 
    };
  }, [token]);
  // Calculate formatted market cap
  const formattedMarketCap = `$${((marketCap * effectivePrice) / 1000).toFixed(2)}K`;
 
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
          <span className="text-green-400 font-semibold">{formattedMarketCap}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">replies:</span>
          <span className="text-white font-semibold">{replyCount}</span>
        </div>
      </div>
    </div>
  );
};
 
export default NavigationHeader;
 
