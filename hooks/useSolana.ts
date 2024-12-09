import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

import { RPC } from "@/utils/constants";

const getCheckPrice = (numChecks: number): number => {
  if (numChecks <= 0) {
    throw new Error("Number of checks must be greater than 0");
  }

  const pricing = {
    1: 0.8,
    2: 1.4,
    3: 1.9,
    4: 2.4,
    5: 2.8,
    6: 3.2,
  };

  // Use type assertion to tell TypeScript the key is valid
  if (pricing[numChecks as keyof typeof pricing]) {
    return pricing[numChecks as keyof typeof pricing];
  }

  // Calculate scalable discount for more than 6 checks
  const basePrice = 0.8 * numChecks;
  const discount = 0.33 * numChecks; // Approximate discount rate for bulk purchases
  return basePrice - discount;
};

type BuyChecksResponse = {
  success: boolean;
  message?: string;
};

export default function useSolana() {
  const { connected, publicKey, sendTransaction } = useWallet();

  async function buyChecks(checksAmount: number): Promise<BuyChecksResponse | undefined> {
    if (!publicKey) {
      return { success: false, message: "Wallet not connected" };
    }

    try {
      const connection = new Connection(RPC);

      // Replace with your wallet address
      const recipient = new PublicKey("8EDurUnRAKw5MEDiJtVeYBZS7h7kEVzvYwZpgUeuZAMd");
      const amount = getCheckPrice(checksAmount) * 0.01 * 1e9; // 0.01 SOL in lamports TODO: update to correct amount

      // Create the transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount,
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash("confirmed");

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Transaction constructor initialized successfully
      if (transaction) {
        console.log("Txn created successfully");
      }

      const result = await sendTransaction(transaction, connection);

      if (result) {
        console.log(result);
        return { success: true };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: "Error buying checks" };
    }
  }

  return { buyChecks };
}
