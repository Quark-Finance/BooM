"use client";

import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MiniKit } from "@worldcoin/minikit-js";
import { SlidersHorizontal, Check } from "lucide-react";
import UserAssets from "@/components/userAssets";

interface UserInfo {
  username: string;
  address: string;
  profile_picture_url: string;
}

interface Token {
  name: string;
  symbol: string;
  price: number;
  balance: number;
  icon: string;
}

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sortCriteria, setSortCriteria] = useState<string>("balance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // New loading state

  const filterRef = useRef<HTMLDivElement | null>(null);

  // Fetch User Info using MiniKit wallet
  useEffect(() => {
    const fetchUserInfo = async () => {
      const walletAddress = MiniKit.walletAddress; // Adjusted MiniKit call
      console.log("Wallet address:", walletAddress);

      if (!walletAddress) {
        console.error("Wallet address is missing or invalid");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/fetch-userinfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addresses: [walletAddress] }),
        });

        if (response.ok) {
          const data: { result: UserInfo[] } = await response.json();
          setUserInfo(data.result[0]);
        } else {
          console.error("Failed to fetch user info:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchUserInfo();
  }, []);

  // Sample tokens (could be fetched from an API)
  useEffect(() => {
    const sampleTokens: Token[] = [
      { name: "USD Coin", symbol: "USDC", price: 1.0, icon: "/icons/usdc.png", balance: 43.67 },
      { name: "Ethereum", symbol: "ETH", price: 2145.67, icon: "/icons/ethereum.png", balance: 0.05 },
      { name: "Bitcoin", symbol: "BTC", price: 90145.67, icon: "/icons/bitcoin.png", balance: 0.005 },
      { name: "Solana", symbol: "SOL", price: 190.0, icon: "/icons/solana.png", balance: 0.5 },
    ];
    setTokens(sampleTokens);
  }, []);

  // Calculate total balance
  const totalBalance = tokens.reduce((sum, token) => sum + token.balance * token.price, 0);

  // Sort tokens based on selected criteria
  const sortedTokens = tokens.sort((a, b) => {
    if (sortCriteria === "price") return b.price - a.price;
    if (sortCriteria === "balance") return b.balance - a.balance;
    return 0;
  });

  // Close filter on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  // Loading state handler
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* User Information Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{userInfo?.username || "John Doe"}</h1>
      </div>

      {/* User Profile and Assets */}
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={userInfo?.profile_picture_url || "https://github.com/shadcn.png"} alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold mb-2">My Assets</h2>
          <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* Divider Line with Balance and Filter */}
      <div className="border-t border-gray-300 flex items-center justify-between py-4">
        <div className="text-gray-500 text-lg">${totalBalance.toFixed(2)}</div>
        <SlidersHorizontal
          className="text-gray-500 cursor-pointer"
          onClick={() => setIsFilterOpen(true)}
        />
      </div>

      {/* Display User Assets */}
      <UserAssets />

      {/* Bottom Sheet Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-background/50 flex justify-center items-end z-50">
          <div ref={filterRef} className="rounded-t-xl bg-background w-full max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 px-5">Choose metrics</h2>
            {["balance", "price"].map((criteria) => (
              <button
                key={criteria}
                className={`w-full text-left text-lg py-3 px-5 mb-2 flex items-center justify-between rounded-lg ${
                  sortCriteria === criteria ? "bg-blue-200 p-2 dark:bg-primary/10" : ""
                }`}
                onClick={() => {
                  setSortCriteria(criteria);
                  setIsFilterOpen(false);
                }}
              >
                {criteria === "balance" ? "Balance" : "Price"}
                {sortCriteria === criteria && <Check className="text-blue-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
