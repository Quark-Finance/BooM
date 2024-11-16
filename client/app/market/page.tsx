// app/market/page.tsx

import { Coins } from 'lucide-react';
import TrendingCoins from '@/components/market/trendingCoins';
import TradeSection from '@/components/market/tradeSection';

interface Token {
  name: string;
  symbol: string;
  price: number;
  balance: number;
  icon: string;
}

export default function Marketplace() {
  const initialTokens: Token[] = [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      price: 1.0,
      icon: '/icons/usdc.png',
      balance: 1000.0,
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2145.67,
      icon: '/icons/ethereum.png',
      balance: 0.05,
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 90145.67,
      icon: '/icons/bitcoin.png',
      balance: 0.005,
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      price: 190.0,
      icon: '/icons/solana.png',
      balance: 0.5,
    },
  ];

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center text-primary">
        <Coins className="mr-2" />
        Marketplace
      </h1>

      {/* Your Tokens Section */}
      <TradeSection initialTokens={initialTokens} />

      {/* Trending Coins Section */}
      <TrendingCoins />
    </div>
  );
}
