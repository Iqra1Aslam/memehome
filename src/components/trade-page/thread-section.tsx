"use client";
import type React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TabButton } from "./ui/tab-button";
import { ThreadMessage } from "./ui/thread-message";
import { useState, useEffect } from "react";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
// import { io } from "socket.io-client";
// import Ably from "ably";
import { channel } from "../../utils/ablyClient";

const URL = import.meta.env.VITE_API_URL || "http://localhost:8000/";
console.log("threadapi", URL);

interface Trade {
  account: string;
  type: "buy" | "sell";
  tokenAmount: number;
  solAmount: number;
  txHex: string;
  tokenAddress: string;
  timestamp: string;
}

interface ThreadSectionProps {
  activeTab: "thread" | "trades";
  setActiveTab: (tab: "thread" | "trades") => void;
  tokenName: string;
  trades?: Trade[];
  tokenAddress?: string;
}

const ThreadSection: React.FC<ThreadSectionProps> = ({
  activeTab,
  setActiveTab,
  // tokenName,
  trades = [],
  tokenAddress,
}) => {
  const [fetchedTrades, setFetchedTrades] = useState<Trade[]>(trades);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [coinId, setCoinId] = useState(null);
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const wallet = useWallet();
  const publickey = wallet.publicKey;
  // const ably = new Ably.Realtime("qR94EA.6wk1Hw:8rEGkjC032riq48eMyuO0sHv4K_j04YjhZGpoYF1hCU");
  // const channel = ably.channels.get("coins");

  const truncateAddress = (address: string) =>
    `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;

  const formatTokenAmount = (amount: number): string => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(2)}k`;
    return amount.toString();
  };

  const formatSolAmount = (amount: number): string => amount.toFixed(4);

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const tradeTime = new Date(timestamp);
    const diffSec = Math.floor((now.getTime() - tradeTime.getTime()) / 1000);
    if (diffSec < 60) return `${diffSec} sec ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
    return `${Math.floor(diffSec / 86400)} day${
      diffSec >= 172800 ? "s" : ""
    } ago`;
  };

  const fetchTrades = async () => {
    if (!tokenAddress) {
      console.log("No tokenAddress provided for fetching trades");
      setFetchedTrades(trades);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`${URL}coin/api/trades/${tokenAddress}`);
      const tradesData = response.data.trades || [];
      console.log("Fetched trades from backend:", tradesData);
      // Sort trades by timestamp (newest first)
      const sortedTrades = tradesData.sort(
        (a: Trade, b: Trade) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setFetchedTrades(sortedTrades);
    } catch (error) {
      console.error("Error fetching trades:", error);
      setFetchedTrades(trades);
    } finally {
      setIsLoading(false);
    }
  };
  // Initial fetch
  useEffect(() => {
    fetchTrades();
  }, [tokenAddress]);

  useEffect(() => {
    if (!tokenAddress) return;
    const onNewTrade = (message: any) => {
      const tradeData = message.data;
      console.log("new trade received via Ably", tradeData);

      // If user is on trades tab, update local state with the new trade
      if (activeTab === "trades") {
        setFetchedTrades((prevTrades) => {
          const updatedTrades = [...prevTrades, tradeData];

          // Sort by timestamp (newest first)
          return updatedTrades.sort(
            (a: Trade, b: Trade) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });
      }
    };
    channel.subscribe("new_trade", onNewTrade);
    return () => {
      channel.unsubscribe("new_trade", onNewTrade);
    };
  }, [tokenAddress, activeTab]);

  useEffect(() => {
    fetchStoredMessages();
  }, [trades]);

  const handleTabClick = (tab: "thread" | "trades") => {
    setActiveTab(tab);
    if (tab === "trades") {
      setShouldFetch(true);
    }
  };

  // const fetchStoredMessages = async () => {
  //   try {
  //     const response = await axios.get(`${URL}coin/getMessage/${tokenAddress}`);
  //     console.log("Coin details fetched successfully:", response.data);
  //     // Sort messages by timestamp (newest first)
  //     const sortedMessages = response.data.sort((a: any, b: any) =>
  //       new Date(b.time).getTime() - new Date(a.time).getTime()
  //     );
  //     setMessages(sortedMessages);
  //   } catch (error) {
  //     console.error("Failed to fetch coin details:", error);
  //   }
  // };

  const fetchStoredMessages = async () => {
    try {
      const response = await axios.get(`${URL}coin/getMessage/${tokenAddress}`);
      console.log("Coin msg details fetched successfully:", response.data);
      // Sort messages by timestamp (newest first)
      const sortedMessages = response.data.sort(
        (a: any, b: any) =>
          new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      setMessages(sortedMessages);
    } catch (error) {
      console.error("Failed to fetch coin details:", error);
    }
  };
  useEffect(() => {
    channel.subscribe("coinAdded", (message: any) => {
      console.log("New message received in real-time:", message.data);
      setMessages((prev) => [...prev, message.data.savedMessage]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handlePostMessage = async () => {
    const payload = {
      msg,
      tokenAddress,
      walletAddress: publickey?.toBase58(),
    };
    try {
      const response = await axios.post(`${URL}coin/message`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Message posted successfully:", response.data);
      const coinId = response.data.coinId;
      setCoinId(coinId);
      setMsg("");
      setIsDialogOpen(false);
      fetchStoredMessages();
    } catch (error) {
      console.error("Failed to post message:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4 shadow-lg shadow-purple-500/5"
    >
      <div className="flex items-center space-x-4 mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pb-2">
        <TabButton
          active={activeTab === "thread"}
          onClick={() => handleTabClick("thread")}
          label="thread"
          color="green"
        />
        <TabButton
          active={activeTab === "trades"}
          onClick={() => handleTabClick("trades")}
          label="trades"
          color="purple"
        />
      </div>

      {activeTab === "thread" ? (
        <div className="space-y-4">
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <ThreadMessage
                  key={index}
                  username={msg.sender?.name || "Anonymous"}
                  timestamp={
                    msg.time ? new Date(msg.time).toLocaleString() : "N/A"
                  }
                  message={msg.message || "No message available"}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No messages available
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 rounded-lg border border-dashed border-purple-500/40 text-purple-400 text-sm hover:bg-purple-500/10 transition-colors flex items-center justify-center space-x-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <span>post a reply</span>
            <Sparkles size={14} />
          </motion.button>

          {/* Dialog Box */}
          {isDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
              <div className="bg-gradient-to-br from-gray-900/80 to-purple-900/20 p-6 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/10 w-[90%] max-w-md">
                <h2 className="text-lg font-semibold mb-4">Post a Reply</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full border border-gray-700 rounded-lg p-2 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-purple-500"
                    placeholder="Type your message..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePostMessage}
                      className="py-2 px-4 bg-purple-700 text-white rounded-lg hover:bg-purple-600"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // </div>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <div className="w-4 h-4 border-2 border-t-purple-400 border-gray-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-black/40 border-b border-gray-800">
                  <tr>
                    <th scope="col" className="px-4 py-2">
                      Account
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Type
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Tokens
                    </th>
                    <th scope="col" className="px-4 py-2">
                      SOL
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Transaction
                    </th>
                    <th scope="col" className="px-4 py-2">
                      Time Ago
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fetchedTrades.length > 0 ? (
                    fetchedTrades.map((trade, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-800 hover:bg-gray-900/50"
                      >
                        <td className="px-4 py-2 font-mono">
                          <a
                            href={`https://explorer.solana.com/address/${trade.account}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300"
                          >
                            {truncateAddress(trade.account)}
                          </a>
                        </td>
                        <td
                          className={`px-4 py-2 ${
                            trade.type === "buy"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {trade.type}
                        </td>
                        <td className="px-4 py-2">
                          {formatTokenAmount(trade.tokenAmount)}
                        </td>
                        <td className="px-4 py-2">
                          {formatSolAmount(trade.solAmount)} SOL
                        </td>
                        <td className="px-4 py-2">
                          <a
                            href={`https://explorer.solana.com/tx/${trade.txHex}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 font-mono truncate block max-w-[150px]"
                            title={trade.txHex}
                          >
                            {trade.txHex.slice(0, 8)}...
                          </a>
                        </td>
                        <td className="px-4 py-2">
                          {formatTimeAgo(trade.timestamp)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-gray-500 py-4"
                      >
                        No trades available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ThreadSection;
