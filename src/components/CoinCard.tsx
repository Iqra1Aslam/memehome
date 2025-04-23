// import React from "react";
// import { formatDistanceToNow } from "date-fns";

// const getTimeAgo = (dateString: string) => {
//   const date = new Date(dateString);
//   return formatDistanceToNow(date, { addSuffix: true });
// };

// interface Coin {
//   _id: string;
//   name: string;
//   ticker: string;
//   imgUrl: string;
//   marketCap: number;
//   creator: {
//     _id: string;
//     name: string;
//     wallet: string;
//     avatar: string;
//     __v: number;
//   };
//   description: string;
//   holders: number;
//   volume24h: string;
//   price: string;
//   change24h: string;
//   date: string;
// }

// interface CoinCardProps {
//   coin: Coin;
//   onTradeClick: () => void;
//   price: number | null;
// }

// const CoinCard: React.FC<CoinCardProps> = ({ coin, onTradeClick, price }) => {
//   const truncateCreator = (wallet: string, maxLength: number = 20) => {
//     const trimmedWallet = wallet.trim();
//     if (!trimmedWallet) return "Unknown Creator";
//     if (trimmedWallet.length <= maxLength) return trimmedWallet;
//     return trimmedWallet.substring(0, maxLength) + "...";
//   };

//   const timeAgo = getTimeAgo(coin.date);

//   return (
//     <div
//       onClick={onTradeClick}
//       className="relative rounded-lg min-w-[280px] w-full bg-black/80 border border-gray-700 flex h-24 hover:cursor-pointer" // Fixed height to ensure consistency
//     >
//       {/* Left side - Image */}
//       <div className="relative w-20 h-20 flex-shrink-0">
//         <img
//           src={coin.imgUrl}
//           alt={coin.name}
//           className="w-full h-full object-cover rounded-l-lg"
//         />
//       </div>

//       {/* Right side - Content */}
//       <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
//         <div>
//           {/* Top row: Name, Ticker, and Market Cap */}
//           <div className="flex items-center justify-between mb-1">
//             <h3 className="text-sm font-bold text-white truncate">
//               {coin.name} <span className="text-gray-400">({coin.ticker})</span>
//             </h3>
//             <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs whitespace-nowrap">
//               ${((coin.marketCap * (price ?? 164.91)) / 1000).toFixed(2)}K
//             </span>
//           </div>

//           {/* Description with overflow handling */}
//           <p className="text-white/80 text-xs line-clamp-2 overflow-hidden">
//             {coin.description}
//           </p>
//         </div>

//         {/* Bottom row: Created and By */}
//         <div className="flex flex-col gap-0.5 text-xs">
//           <div className="text-gray-400 truncate">Created {timeAgo}</div>
//           <div className="text-gray-400 truncate">
//             By{" "}
//             <span className="text-purple-400">
//               {coin.creator?.wallet
//                 ? truncateCreator(coin.creator.wallet)
//                 : "Unknown"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoinCard;


import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ably } from "./trade-page/ablyClient";
import { useState, useEffect,useRef } from "react";
import axios from "axios";
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

interface Coin {
  _id: string;
  name: string;
  ticker: string;
  imgUrl: string;
  marketCap: number;
  description: string;
  holders: number;
  volume24h: string;
  price: string;
  token:String;
  change24h: string;
  date: string;
  isCrown: boolean;
}

interface CoinCardProps {
  coin: Coin;
  onTradeClick: () => void;
  price: number | null;
 
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, onTradeClick, price }) => {
   const URL = process.env.VITE_API_URL || "http://localhost:8000/";
    const [replyCount, setReplyCount] = useState<number>(0);
     
    
    useEffect(() => {
      const fetchReplyCount = async () => {
        try {
        
          const response = await axios.get(`${URL}coin/reply-count/${coin.token}`);
          
          setReplyCount(response.data.replyCount);  
          
        } catch (error) {
          console.error('Error fetching reply count:', error);
        }
      };
  
      fetchReplyCount();
      
      const channel = ably.channels.get(`reply-count-${coin.token}`);
  
      channel.subscribe('reply-count', (message) => {
      
    //  console.log(message.data); 
      setReplyCount(message.data.replyCount);
      
      });
      return () => {
        // channel.unsubscribe(); 
      };
    }, [coin.token]);
  const timeAgo = getTimeAgo(coin.date);

  return (
    <div
      onClick={onTradeClick}
      className="relative rounded-lg min-w-[280px] w-full bg-black/80 border border-gray-700 flex h-24 hover:cursor-pointer" // Reduced height for compactness
    >
      {/* Left side - Image */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <img
          src={coin.imgUrl}
          alt={coin.name}
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>

      {/* Right side - Content */}
      <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
        <div>
          {/* Top row: Name, Ticker, and Market Cap */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-white truncate">
              {coin.name} <span className="text-gray-400">({coin.ticker})</span>
            </h3>
            {coin.isCrown === true ? "👑" : null}
            <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs whitespace-nowrap">
              ${((coin.marketCap * (price ?? 164.91)) / 1000).toFixed(2)}K
            </span>
          
         
          </div>

          {/* Description with overflow handling */}
          <p className="text-white/80 text-xs line-clamp-3 overflow-hidden">
          
            {coin.description}
              <p >replies: <span>{replyCount||0}</span>
            </p>
          </p>
        </div>

        {/* Bottom row: Created Time Ago */}
        <div className="text-gray-300 text-[10px] truncate">
          Created {timeAgo}
        </div>
      </div>
    </div>
  );
};

export default CoinCard;