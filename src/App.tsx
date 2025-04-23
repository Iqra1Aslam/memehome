// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "./components/Navbar";
// import HeroSection from "./components/HeroSection";
// import ListingCoin from "./components/ListingCoin";
// import CreateToken from "./components/CreateToken";
// import TradePage from "./components/TradePage";
// import { getSolPrice } from "./components/SolToUsd";
// import CoinCard from "./components/listcoin/CoinCard"; // Import CoinCard from ListingCoin
// import "./index.css";

// const URL = import.meta.env.VITE_API_URL;

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

// function App() {
//   const [isCreateTokenOpen, setIsCreateTokenOpen] = useState(false);
//   const [isTradePageOpen, setIsTradePageOpen] = useState(false);
//   const [selectedToken, setSelectedToken] = useState<Coin | null>(null);
//   const [coins, setCoins] = useState<Coin[]>([]);
//   const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [price, setPrice] = useState<number | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   useEffect(() => {
//     const fetchCoins = async () => {
//       try {
//         const response = await fetch(`${URL}coin/getAllCoins`);
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setCoins(data);
//         setFilteredCoins(data);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCoins();
//   }, []);

//   useEffect(() => {
//     async function fetchPrice() {
//       const solPrice = await getSolPrice();
//       setPrice(solPrice);
//     }

//     fetchPrice();
//     const interval = setInterval(fetchPrice, 50000);
//     return () => clearInterval(interval);
//   }, []);

//   const highMarketCapCoins = coins.filter(
//     (coin) => coin.marketCap * (price ?? 164.91) > 4000
//   );

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     const filtered = coins.filter(
//       (coin) =>
//         coin.name.toLowerCase().includes(query.toLowerCase()) ||
//         coin.ticker.toLowerCase().includes(query.toLowerCase())
//     );
//     const regularFilteredCoins = filtered.filter(
//       (coin) => coin.marketCap * (price ?? 164.91) <= 4000
//     );
//     setFilteredCoins(regularFilteredCoins);
//   };

//   const topCoin =
//     coins.length > 0
//       ? coins.reduce((prev, current) =>
//           prev.marketCap > current.marketCap ? prev : current
//         )
//       : null;

//   const handleTradeClick = (token: Coin) => {
//     setSelectedToken(token);
//     setIsTradePageOpen(true);
//   };

//   if (loading) return <div className="text-white text-center">Loading...</div>;
//   if (error)
//     return <div className="text-red-500 text-center">Error: {error}</div>;

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <AnimatePresence>
//         {!isCreateTokenOpen && !isTradePageOpen ? (
//           <motion.div
//             key="home"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <Navbar onLaunchClick={() => setIsCreateTokenOpen(true)} />
//             <HeroSection
//               onCreateClick={() => setIsCreateTokenOpen(true)}
//               topCoin={topCoin}
//               price={price}
//               onTradeClick={handleTradeClick}
//               onSearch={handleSearch}
//               highMarketCapCoins={highMarketCapCoins}
//               CoinCardComponent={CoinCard} // Pass CoinCard from ListingCoin
//             />
//             <ListingCoin
//               onTradeClick={handleTradeClick}
//               coins={filteredCoins}
//               price={price}
//             />
//           </motion.div>
//         ) : isCreateTokenOpen ? (
//           <CreateToken onClose={() => setIsCreateTokenOpen(false)} />
//         ) : (
//           <TradePage
//             onBack={() => setIsTradePageOpen(false)}
//             tokenData={selectedToken}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default App;

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "./components/Navbar";
// import HeroSection from "./components/HeroSection";
// import ListingCoin from "./components/ListingCoin";
// import CreateToken from "./components/CreateToken";
// import TradePage from "./components/TradePage";
// import HowItWorks from "./page/HowItWorks";
// import { getSolPrice } from "./components/SolToUsd";
// import CoinCard from "./components/listcoin/CoinCard";
// import "./index.css";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import Home from "./components/Home";

// const URL = import.meta.env.VITE_API_URL;

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

// function App() {
//   const [selectedToken, setSelectedToken] = useState<Coin | null>(null);
//   const [coins, setCoins] = useState<Coin[]>([]);
//   const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [price, setPrice] = useState<number | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [kothCoins, setKothCoins] = useState<Coin[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCoins = async () => {
//       try {
//         const response = await fetch(`${URL}coin/getAllCoins`);
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setCoins(data);
//         setFilteredCoins(data);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCoins();
//     const fetchCrownTokens = async () => {
//       try {
//         const getCrownCoins = await fetch(`${URL}coin/getkothCoins`);
//         console.log("getkothcoins: ", getCrownCoins);
//         if (!getCrownCoins.ok) {
//           throw new Error("Response was not ok");
//         }
//         const data = await getCrownCoins.json();
//         console.log("data of koth tokens: ", data.data);
//         if (Array.isArray(data.data)) {
//           setKothCoins(data.data);
//         }
//       } catch (error) {
//         console.error("error getting koth coins: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCrownTokens();
//   }, []);

//   useEffect(() => {
//     async function fetchPrice() {
//       const solPrice = await getSolPrice();
//       setPrice(solPrice);
//     }

//     fetchPrice();
//     const interval = setInterval(fetchPrice, 50000);
//     return () => clearInterval(interval);
//   }, []);

//   const highMarketCapCoins = kothCoins;

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     const filtered = coins.filter(
//       (coin) =>
//         coin.name.toLowerCase().includes(query.toLowerCase()) ||
//         coin.ticker.toLowerCase().includes(query.toLowerCase())
//     );
//     const regularFilteredCoins = filtered.filter(
//       (coin) => coin.marketCap * (price ?? 164.91) <= 4000
//     );
//     setFilteredCoins(regularFilteredCoins);
//   };

//   const topCoin =
//     coins.length > 0
//       ? coins.reduce((prev, current) =>
//           prev.marketCap > current.marketCap ? prev : current
//         )
//       : null;

//   const handleTradeClick = (token: Coin) => {
//     setSelectedToken(token);
//     // Pass tokenData to TradePage via navigation state and navigate
//     navigate("/token-detail", {
//       state: {
//         tokenData: {
//           id: token._id,
//           name: token.name,
//           symbol: token.ticker,
//           imgUrl: token.imgUrl,
//           marketCap: `${(token.marketCap * (price ?? 164.91)).toFixed(2)}`,
//           price: token.price,
//           change24h: token.change24h,
//           volume24h: token.volume24h,
//           description: token.description,
//           ticker: token.ticker,
//         },
//       },
//     });
//   };

//   if (loading) return <div className="text-white text-center">Loading...</div>;
//   if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <AnimatePresence>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <Home
//                 topCoin={topCoin}
//                 price={price}
//                 handleSearch={handleSearch}
//                 highMarketCapCoins={highMarketCapCoins}
//                 CoinCard={CoinCard}
//                 filteredCoins={filteredCoins}
//                 handleTradeClick={handleTradeClick}
//               />
//             }
//           />
//           <Route
//             path="/create-token"
//             element={<CreateToken onClose={() => navigate("/")} />}
//           />
//           <Route
//             path="/token-detail"
//             element={
//               <TradePage onBack={() => navigate("/")} tokenData={selectedToken} />
//             }
//           />
//           <Route path="/how-it-works" element={<HowItWorks />} />
//         </Routes>
//       </AnimatePresence>
//     </div>
//   );
// }

// export default App;

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "./components/Navbar";
// import HeroSection from "./components/HeroSection";
// import ListingCoin from "./components/ListingCoin";
// import CreateToken from "./components/CreateToken";
// import TradePage from "./components/TradePage";
// import HowItWorks from "./page/HowItWorks";
// import { getSolPrice } from "./components/SolToUsd";
// import CoinCard from "./components/listcoin/CoinCard";
// import "./index.css";
// import { Routes, Route, useNavigate } from "react-router-dom";
// import Home from "./components/Home";

// const URL = import.meta.env.VITE_API_URL;

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

// function App() {
//   const [selectedToken, setSelectedToken] = useState<Coin | null>(null);
//   const [coins, setCoins] = useState<Coin[]>([]);
//   const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [price, setPrice] = useState<number | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [kothCoins, setKothCoins] = useState<Coin[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCoins = async () => {
//       try {
//         const response = await fetch(`${URL}coin/getAllCoins`);
//         if (!response.ok) throw new Error("Network response was not ok");
//         const data = await response.json();
//         setCoins(data);
//         setFilteredCoins(data);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCoins();
//     const fetchCrownTokens = async () => {
//       try {
//         const getCrownCoins = await fetch(`${URL}coin/getkothCoins`);
//         if (!getCrownCoins.ok) throw new Error("Response was not ok");
//         const data = await getCrownCoins.json();
//         if (Array.isArray(data.data)) setKothCoins(data.data);
//       } catch (error) {
//         console.error("error getting koth coins: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCrownTokens();
//   }, []);

//   useEffect(() => {
//     async function fetchPrice() {
//       const solPrice = await getSolPrice();
//       setPrice(solPrice);
//     }

//     fetchPrice();
//     const interval = setInterval(fetchPrice, 50000);
//     return () => clearInterval(interval);
//   }, []);

//   const highMarketCapCoins = kothCoins;

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     const filtered = coins.filter(
//       (coin) =>
//         coin.name.toLowerCase().includes(query.toLowerCase()) ||
//         coin.ticker.toLowerCase().includes(query.toLowerCase())
//     );
//     const regularFilteredCoins = filtered.filter(
//       (coin) => coin.marketCap * Pandoc.Lua.Type.number(price ?? 164.91) <= 4000
//     );
//     setFilteredCoins(regularFilteredCoins);
//   };

//   const topCoin =
//     coins.length > 0
//       ? coins.reduce((prev, current) =>
//           prev.marketCap > current.marketCap ? prev : current
//         )
//       : null;

//   const handleTradeClick = (token: Coin) => {
//     setSelectedToken(token);
//     navigate("/token-detail", {
//       state: {
//         tokenData: {
//           id: token._id,
//           name: token.name,
//           symbol: token.ticker,
//           imgUrl: token.imgUrl,
//           marketCap: `${(token.marketCap * (price ?? 164.91)).toFixed(2)}`,
//           price: token.price,
//           change24h: token.change24h,
//           volume24h: token.volume24h,
//           description: token.description,
//           ticker: token.ticker,
//         },
//       },
//     });
//   };

//   // Define the launch handler
//   const handleLaunchClick = () => {
//     navigate("/create-token");
//   };

//   if (loading) return <div className="text-white text-center">Loading...</div>;
//   if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <AnimatePresence>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <Home
//                 topCoin={topCoin}
//                 price={price}
//                 handleSearch={handleSearch}
//                 highMarketCapCoins={highMarketCapCoins}
//                 CoinCard={CoinCard}
//                 filteredCoins={filteredCoins}
//                 handleTradeClick={handleTradeClick}
//                 onLaunchClick={handleLaunchClick} // Pass to Home
//               />
//             }
//           />
//           <Route
//             path="/create-token"
//             element={<CreateToken onClose={() => navigate("/")} />}
//           />
//           <Route
//             path="/token-detail"
//             element={
//               <>
//                 <Navbar onLaunchClick={handleLaunchClick} /> {/* Add Navbar here */}
//                 <TradePage onBack={() => navigate("/")} tokenData={selectedToken} />
//               </>
//             }
//           />
//           <Route path="/how-it-works" element={<HowItWorks />} />
//         </Routes>
//       </AnimatePresence>
//     </div>
//   );
// }

// export default App;

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "./components/Navbar";
// import CreateToken from "./components/CreateToken";
// import TradePage from "./components/TradePage";
// import HowItWorks from "./page/HowItWorks";
// import { getSolPrice } from "./components/SolToUsd";
// import CoinCard from "./components/listcoin/CoinCard";
// import "./index.css";
// import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import Home from "./components/Home";

// const URL = import.meta.env.VITE_API_URL;

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

// function App() {
//   const [selectedToken, setSelectedToken] = useState<Coin | null>(null);
//   const [coins, setCoins] = useState<Coin[]>([]);
//   const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [price, setPrice] = useState<number | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [kothCoins, setKothCoins] = useState<Coin[]>([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchCoins = async () => {
//       try {
//         const response = await fetch(`${URL}coin/getAllCoins`);
//         if (!response.ok) throw new Error("Network response was not ok");
//         const data = await response.json();
//         setCoins(data);
//         setFilteredCoins(data);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchCrownTokens = async () => {
//       try {
//         const getCrownCoins = await fetch(`${URL}coin/getkothCoins`);
//         if (!getCrownCoins.ok) throw new Error("Response was not ok");
//         const data = await getCrownCoins.json();
//         if (Array.isArray(data.data)) setKothCoins(data.data);
//       } catch (error) {
//         console.error("error getting koth coins: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCoins();
//     fetchCrownTokens();
//   }, []);

//   useEffect(() => {
//     async function fetchPrice() {
//       const solPrice = await getSolPrice();
//       setPrice(solPrice);
//     }

//     fetchPrice();
//     const interval = setInterval(fetchPrice, 50000);
//     return () => clearInterval(interval);
//   }, []);

//   const highMarketCapCoins = kothCoins;

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     const filtered = coins.filter(
//       (coin) =>
//         coin.name.toLowerCase().includes(query.toLowerCase()) ||
//         coin.ticker.toLowerCase().includes(query.toLowerCase())
//     );
//     const regularFilteredCoins = filtered.filter(
//       (coin) => coin.marketCap * (price ?? 164.91) <= 4000
//     );
//     setFilteredCoins(regularFilteredCoins);
//   };

//   const topCoin =
//     coins.length > 0
//       ? coins.reduce((prev, current) =>
//           prev.marketCap > current.marketCap ? prev : current
//         )
//       : null;

//   const handleTradeClick = (token: Coin) => {
//     setSelectedToken(token);
//     navigate("/token-detail", {
//       state: {
//         tokenData: {
//           id: token._id,
//           name: token.name,
//           symbol: token.ticker,
//           imgUrl: token.imgUrl,
//           marketCap: `${(token.marketCap * (price ?? 164.91)).toFixed(2)}`,
//           price: token.price,
//           change24h: token.change24h,
//           volume24h: token.volume24h,
//           description: token.description,
//           ticker: token.ticker,
//         },
//       },
//     });
//   };

//   const handleLaunchClick = () => {
//     navigate("/create-token");
//   };

//   // Preloader component with "memehome is getting ready......." text and opacity animation
//   const Preloader = () => (
//     <motion.div
//       initial={{ opacity: 1 }}
//       animate={{ opacity: loading ? 1 : 0 }}
//       transition={{ duration: 0.5 }}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "#000",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 9999,
//         pointerEvents: loading ? "auto" : "none",
//       }}
//       onAnimationComplete={() =>
//         !loading && (document.body.style.overflow = "auto")
//       }
//     >
//       <div className="text-center">
//         <h1
//           className="text-4xl font-bold animate-pulse-opacity"
//           style={{
//             background: "linear-gradient(to right, #a855f7, #3b82f6)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         >
//           memehome is getting ready.......
//         </h1>
//       </div>
//     </motion.div>
//   );

//   // Only show preloader on homepage ("/") and while loading
//   const showPreloader = location.pathname === "/" && loading;

//   if (error)
//     return <div className="text-red-500 text-center">Error: {error}</div>;

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Show preloader only on homepage while loading */}
//       {showPreloader && <Preloader />}

//       {/* Main content */}
//       <AnimatePresence>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <Home
//                 topCoin={topCoin}
//                 price={price}
//                 handleSearch={handleSearch}
//                 highMarketCapCoins={highMarketCapCoins}
//                 CoinCard={CoinCard}
//                 filteredCoins={filteredCoins}
//                 handleTradeClick={handleTradeClick}
//                 onLaunchClick={handleLaunchClick}
//               />
//             }
//           />
//           <Route
//             path="/create-token"
//             element={<CreateToken onClose={() => navigate("/")} />}
//           />
//           <Route
//             path="/token-detail"
//             element={
//               <>
//                 <Navbar onLaunchClick={handleLaunchClick} />
//                 <TradePage
//                   onBack={() => navigate("/")}
//                   tokenData={selectedToken}
//                 />
//               </>
//             }
//           />
//           <Route path="/how-it-works" element={<HowItWorks />} />
//         </Routes>
//       </AnimatePresence>
//     </div>
//   );
// }

// export default App;


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import CreateToken from "./components/CreateToken";
import TradePage from "./components/TradePage";
import { getSolPrice } from "./components/SolToUsd";
import CoinCard from "./components/listcoin/CoinCard";
import Ably from "ably";

import { channel } from "./components/trade-page/ablyClient";
import "./index.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./components/Home";

const URL = import.meta.env.VITE_API_URL;

interface Coin {
  _id: string;
  name: string;
  ticker: string;
  imgUrl: string;
  marketCap: number;
  creator: {
    _id: string;
    name: string;
    wallet: string;
    avatar: string;
    __v: number;
  };
  description: string;
  holders: number;
  volume24h: string;
  price: string;
  token:String;
  change24h: string;
  date: string;
}

function App() {
  const [selectedToken, setSelectedToken] = useState<Coin | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [kothCoins, setKothCoins] = useState<Coin[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  // const ably = new Ably.Realtime("qR94EA.6wk1Hw:8rEGkjC032riq48eMyuO0sHv4K_j04YjhZGpoYF1hCU");
  // const channel = ably.channels.get("coins");
  
  


  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(`${URL}coin/getAllCoins`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        
        setCoins(data);
        setFilteredCoins(data);
         
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCrownTokens = async () => {
      try {
        const getCrownCoins = await fetch(`${URL}coin/getkothCoins`);
        if (!getCrownCoins.ok) throw new Error("Response was not ok");
        const data = await getCrownCoins.json();
        if (Array.isArray(data.data)) setKothCoins(data.data);
      } catch (error) {
        console.error("error getting koth coins: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    fetchCrownTokens();
  // Initial fetches
  fetchCoins();
  fetchCrownTokens();

  // socket listener: coinAdded
  const handleNewCoin = (message: any) => {
    const newCoin = message.data;
    console.log("New coin received via Ably:", newCoin);
    setCoins((prevCoins) => [...prevCoins, newCoin]);
    setFilteredCoins((prevCoins) => [...prevCoins, newCoin]);
  };

  channel.subscribe("coinAdded", handleNewCoin);


  // socket listener: kothGet (only to re-fetch tokens)
  const handleKothGet = (message: any) => {
    console.log("kothGet event received:", message);
    fetchCrownTokens(); // just re-fetch tokens
  };

 channel.subscribe("kothGet",handleKothGet)
  // Cleanup on unmount
  return () => {
    channel.unsubscribe("coinAdded", handleNewCoin);
    channel.unsubscribe("kothGet",handleKothGet);
  };
}, []);


  useEffect(() => {
    async function fetchPrice() {
      const solPrice = await fetch(`${URL}coin/sol-price`);
      const setSolPrice = await solPrice.json();

      console.log("sol price: ", setSolPrice.USD);
      localStorage.setItem("sol-price", setSolPrice.USD);

      setPrice(setSolPrice.USD);

    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 50000);
    return () => clearInterval(interval);
  }, []);

  const highMarketCapCoins = kothCoins;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.ticker.toLowerCase().includes(query.toLowerCase())
    );
    const regularFilteredCoins = filtered.filter(
      (coin) => coin.marketCap * (price ?? 164.91) <= 4000
    );
    setFilteredCoins(regularFilteredCoins);
  };

  const topCoin =
    coins.length > 0
      ? coins.reduce((prev, current) =>
          prev.marketCap > current.marketCap ? prev : current
        )
      : null;

  const handleTradeClick = (token: Coin) => {
    setSelectedToken(token);
    console.log("token.token",token.token);
    navigate("/token-detail", {
      state: {
        tokenData: {
          id: token._id,
          name: token.name,
          symbol: token.ticker,
          imgUrl: token.imgUrl,
          marketCap: `${(token.marketCap * (price ?? 164.91)).toFixed(2)}`,
          price: token.price,
          token:token.token,
          change24h: token.change24h,
          volume24h: token.volume24h,
          description: token.description,
          ticker: token.ticker,
        },
      },
    });
  };

  const handleLaunchClick = () => {
    navigate("/create-token");
  };

  // Preloader component with "memehome is getting ready......." text and opacity animation
  const Preloader = () => (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: loading ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        pointerEvents: loading ? "auto" : "none",
      }}
      onAnimationComplete={() =>
        !loading && (document.body.style.overflow = "auto")
      }
    >
      <div className="text-center">
        <h1
          className="text-4xl font-bold animate-pulse-opacity"
          style={{
            background: "linear-gradient(to right, #a855f7, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          memehome is getting ready.......
        </h1>
      </div>
    </motion.div>
  );

  // Only show preloader on homepage ("/") and while loading
  const showPreloader = location.pathname === "/" && loading;

  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Show preloader only on homepage while loading */}
      {showPreloader && <Preloader />}

      {/* Main content */}
      <AnimatePresence>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                topCoin={topCoin}
                price={price}
                // token={token}
                handleSearch={handleSearch}
                highMarketCapCoins={highMarketCapCoins}
                CoinCard={CoinCard}
                filteredCoins={filteredCoins}
                handleTradeClick={handleTradeClick}
                onLaunchClick={handleLaunchClick}
              />
            }
          />
          <Route
            path="/create-token"
            element={<CreateToken onClose={() => navigate("/")} />}
          />
          <Route
            path="/token-detail"
            element={
              <>
                <Navbar onLaunchClick={handleLaunchClick} />
                <TradePage
                  onBack={() => navigate("/")}
                  tokenData={selectedToken}
                  price={price} // Pass the price prop here
                  
                />
              </>
            }
          />
          {/* Removed the /how-it-works route */}
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;