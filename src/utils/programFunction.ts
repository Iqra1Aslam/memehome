 
import axios from "axios";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { program } from "./anchorClient";
const metadataProgram = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { convertFromFloat, convertToFloat } from "./util";
import BN from "bn.js";
// import { token } from "@coral-xyz/anchor/dist/cjs/utils";
 
const L = console.log;
 
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
export type Token = {
  name: string;
  symbol: string;
  image: string;
  description: string;
};
 
export const uploadImagePinata = async (file: File) => {
  if (file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
 
      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: "da4de1d13bb5283d5982",
          pinata_secret_api_key:
            "36f77290d172dba3b8fca335758984f317b91fa81012a500e49aedbb7304a13d",
          "Content-Type": "multipart/form-data",
        },
      });
 
      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.log(error);
    }
  }
};
 
export const uploadMetadata = async (token: Token) => {
  const { name, symbol, description, image } = token;
  if (!name || !symbol || !description || !image) {
    return console.log("Data Missing");
  }
 
  const data = JSON.stringify({
    name: name,
    symbol: symbol,
    description: description,
    image: image,
  });
 
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
        pinata_api_key: "da4de1d13bb5283d5982",
        pinata_secret_api_key:
          "36f77290d172dba3b8fca335758984f317b91fa81012a500e49aedbb7304a13d",
        "Content-Type": "application/json",
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.log(error);
  }
};
 
export const [configPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("global-config")],
  program.programId
);
 
export const calculateBondingCurveProgress = async (
  bId: string,
  totalSupply: number // Total token supply (e.g., 800 million)
): Promise<number> => {
  try {
    // Fetch the bonding curve account data
    const bondingCurve = (await program.account.bondingCurve.fetch(
      `${bId}`
    )) as BondingCurveData;
 
    // Extract the real token reserves and adjust for decimals
    const realTokenReserves =
      bondingCurve.realTokenReserves.toNumber() / 1_000_000;
      L("real token reserves", realTokenReserves);
 
    // Calculate the percentage of tokens distributed
    const remainingPercentage = (realTokenReserves / totalSupply) * 100;
 
    // Calculate the percentage of tokens already distributed
    const distributedPercentage = 100 - remainingPercentage;
 
    console.log(
      `Bonding Curve Distributed Progress: ${distributedPercentage.toFixed(2)}%`
    );
    return distributedPercentage; // Return the distributed percentage
  } catch (error) {
    console.error("Error calculating bonding curve progress:", error);
    return 0; // Return 0% if there's an error
  }
};
 
// export const KingOfTheHillProgress = async (BID: string): Promise<number> => {
//   try {
//     const bondingCurveBalance = await connection.getBalance(
//       new PublicKey(`${BID}`)
//     );
//     const kothProgress = (bondingCurveBalance / 1000000000 / 90) * 100;
//     return kothProgress;
//   } catch (error) {
//     console.error("Error calculating king of the hill progress", error);
//     return 0;
//   }
// };
 
export const getBondingCurve = (tokenMintPubkey: string) => {
  const tokenPubkey = new PublicKey(tokenMintPubkey);
  const [bondingCurvePda, _] = PublicKey.findProgramAddressSync(
    [Buffer.from("bonding-curve"), tokenPubkey.toBytes()],
    program.programId
  );
  return bondingCurvePda;
};
 
export const getCurveAdddressFunc = async (tokenMintPubkey: string) => {
  const tokenPubKey = new PublicKey(tokenMintPubkey);
  const bondingCurvePda = getBondingCurve(tokenMintPubkey);
  const curveTokenAccount = await getAssociatedTokenAddress(
    tokenPubKey,
    bondingCurvePda,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return curveTokenAccount;
};
 
export const getMetadataFunc = async (tokenMintkp: Keypair) => {
  const [tokenMetadata] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      metadataProgram.toBuffer(),
      tokenMintkp.publicKey.toBuffer(),
    ],
    metadataProgram
  );
  return tokenMetadata;
};
 
export const calculateAmountOutBuy = async (
  reserveLamport: number,
  adjustedAmount: number,
  tokenOneDecimals: number,
  reserveToken: number,
  bId: string
) => {
  // Fetch the bonding curve account data
  const bondingCurve = (await program.account.bondingCurve.fetch(
    `${bId}`
  )) as BondingCurveData;
 
  // Check if the bonding curve is completed
  if (bondingCurve.isCompleted) {
    return "Listed on Raydium!";
  }
 
  // Calculate the denominator sum which is (y+dy)
  const denominatorSum = reserveLamport + adjustedAmount;
  // Convert to float for division
  const denominatorSumFloat = convertToFloat(denominatorSum, tokenOneDecimals);
  const adjustedAmountFloat = convertToFloat(adjustedAmount, tokenOneDecimals);
 
  // (y + dy) / dy
  const divAmt = denominatorSumFloat / adjustedAmountFloat;
 
  // Convert reserveToken to float with 9 decimals
  const reserveTokenFloat = convertToFloat(reserveToken, 9);
 
  // Calculate dx = xdy / (y + dy)
  const amountOutInFloat = reserveTokenFloat / divAmt;
 
  // Convert the result back to the original decimal format
  const amountOut = convertFromFloat(amountOutInFloat, 9);
 
  return amountOut;
};
 
export const calculateAmountBuy = async (value: number, bId: String) => {
  const bondingCurve = (await program.account.bondingCurve.fetch(
    `${bId}`
  )) as BondingCurveData;
  const virtual_Sol = bondingCurve.virtualSolReserves.toNumber() / 1000000;
  const virtual_token = bondingCurve.virtualTokenReserves.toNumber() / 1000000;
  const amount_out = await calculateAmountOutBuy(
    virtual_Sol,
    value,
    6,
    virtual_token,
    bId.toString()
  );
  return amount_out;
};
 
export const eachTokenPrice = async (bId: string) => {
  // Fetch the bonding curve account data
  const bondingCurve = (await program.account.bondingCurve.fetch(
    `${bId}`
  )) as BondingCurveData;
 
  // Convert virtual reserves to numbers and adjust for decimals
  const virtual_Sol = bondingCurve.virtualSolReserves.toNumber() / 1000000;
  const virtual_token = bondingCurve.virtualTokenReserves.toNumber() / 1000000;
  const limit = bondingCurve.isCompleted;
  console.log("is completed", limit);
 
  // Calculate the price of each token
  const price = virtual_Sol / virtual_token;
 
  // Return the price
  return price;
};
 
export const calculateAmountOutSell = async (
  reserveToken: number,
  adjustedAmount: number,
  tokenOneDecimals: number,
  reserveLamport: number,
  bId: string
) => {
  // Fetch the bonding curve account data
  const bondingCurve = (await program.account.bondingCurve.fetch(
    `${bId}`
  )) as BondingCurveData;
 
  // Check if the bonding curve is completed
  if (bondingCurve.isCompleted) {
    return "Listed on Raydium!";
  }
 
  const numinator = adjustedAmount * reserveLamport;
  const denominatorSum = reserveToken + adjustedAmount;
  const amountOut = numinator / denominatorSum;
  return amountOut;
};
 
export const calculateAmountSell = async (value: number, bId: String) => {
  const bondingCurve = (await program.account.bondingCurve.fetch(
    `${bId}`
  )) as BondingCurveData;
  const virtual_sol = bondingCurve.virtualSolReserves.toNumber() / 1000000;
  const virtual_token = bondingCurve.virtualTokenReserves.toNumber() / 1000000;
  const amount_out = await calculateAmountOutSell(
    virtual_token,
    value,
    6,
    virtual_sol,
    bId.toString()
  );
  return amount_out;
};
 
export const getCurveTokenAccount = async (token: string, bId: string) => {
  const tokenPubKey = new PublicKey(token);
  const bondingCPubkey = new PublicKey(bId);
 
  const curveTokenAccount = await getAssociatedTokenAddress(
    tokenPubKey, // The mint address
    bondingCPubkey, // The bonding_curve PDA authority
    true, // Allow owner to be a PDA
    TOKEN_PROGRAM_ID, // Token program ID
    ASSOCIATED_TOKEN_PROGRAM_ID // Associated token program ID
  );
  return curveTokenAccount;
};
 
export const getUserTokenAccount = async (
  token: string,
  userPubkey: PublicKey
) => {
  const tokenPubkey = new PublicKey(token);
  const userTokenAccount = await getAssociatedTokenAddress(
    tokenPubkey,
    userPubkey,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return userTokenAccount;
};
 
export const getReserves = async (bId: string) => {
  const bondingCurve = (await program.account.bondingCurve.fetch(
    `${bId}`
  )) as BondingCurveData;
  const reserve2 = bondingCurve.virtualSolReserves.toNumber();
  const reserve1 = bondingCurve.virtualTokenReserves.toNumber();
  return { reserve1, reserve2 };
};
 
export const getBondingCurveTokenBalance = async (
  bId: string
): Promise<number | null> => {
  try {
    // Fetch the bonding curve account data
    const bondingCurve = (await program.account.bondingCurve.fetch(
      `${bId}`
    )) as BondingCurveData;
 
    // Extract the real token reserves and convert it to a number
    const realTokenReserves = bondingCurve.realTokenReserves.toNumber();
 
    // Adjust for decimals if necessary (assuming 6 decimals for tokens)
    const tokenBalance = realTokenReserves / 1_000_000;
 
    return tokenBalance;
  } catch (error) {
    console.error("Error fetching bonding curve token balance:", error);
    return null; // Return null in case of an error
  }
};
 
export const getTokenBalance = async (
  walletAddress: string,
  tokenMintAddress: string
) => {
  const wallet = new PublicKey(walletAddress);
  const tokenMint = new PublicKey(tokenMintAddress);
  const response = await connection.getTokenAccountsByOwner(wallet, {
    mint: tokenMint,
  });
 
  if (response.value.length == 0) {
    return;
  }
 
  //get the balance
  const tokenAccountInfo = await connection.getTokenAccountBalance(
    response.value[0].pubkey
  );
  return tokenAccountInfo.value.uiAmount;
};
 
 
export const getRealTokenReserves = async (
  bId: string
): Promise<number> => {
  try {
    // Fetch the bonding curve account data
    const bondingCurve = (await program.account.bondingCurve.fetch(
      `${bId}`
    )) as BondingCurveData;
 
    // Extract and adjust for decimals
    const realTokenReserves = bondingCurve.realTokenReserves.toNumber() / 1_000_000;
    console.log("Real Token Reserves:", realTokenReserves);
 
    return realTokenReserves;
  } catch (error) {
    console.error("Error fetching real token reserves:", error);
    return 0; // Return 0 if there's an error
  }
};
 
interface BondingCurveData {
  virtualTokenReserves: BN;
  virtualSolReserves: BN;
  realTokenReserves: BN;
  realSolReserves: BN;
  tokenTotalSupply: BN;
  isCompleted: boolean;
}
 