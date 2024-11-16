// app/market/page.tsx

'use client'

import { useState } from 'react';
import Image from 'next/image';
import TradeDrawer from '@/components/trade-drawer';
import { Coins } from 'lucide-react';

interface Token {
  name: string;
  symbol: string;
  price: number;
  balance: number;
  icon: string;
}

export default function Marketplace() {
  const [tokens, setTokens] = useState<Token[]>([
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2145.67,
      icon: '/icons/ethereum.png',
      balance: 0.005,
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      price: 1.0,
      icon: '/icons/usdc.png',
      balance: 43.67,
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      price: 190.0,
      icon: '/icons/solana.png',
      balance: 0.5,
    }
  ]);

  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSwap = (sellAmount: number, buyAmount: number) => {
    setTokens((prevTokens) =>
      prevTokens.map((token) => {
        if (token.symbol === 'USDC') {
          return { ...token, balance: token.balance - sellAmount };
        } else if (token.symbol === selectedToken?.symbol) {
          return { ...token, balance: token.balance + buyAmount };
        } else {
          return token;
        }
      })
    );
    setSelectedToken(null);
    setIsDrawerOpen(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center text-primary">
        <Coins className="mr-2" />
        Marketplace
      </h1>
      <ul className="space-y-4">
        {tokens.map((token) => (
          <li
            key={token.symbol}
            className="cursor-pointer hover:bg-secondary/10 transition-colors rounded-lg p-4 flex items-center justify-between"
            onClick={() => {
              setSelectedToken(token);
              setIsDrawerOpen(true);
            }}
          >
            <div className="flex items-center space-x-4">
              <Image
                src={token.icon}
                alt={token.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold">{token.name}</h2>
                <p className="text-sm text-muted-foreground">{token.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">${token.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Balance: {token.balance.toFixed(4)}</p>
            </div>
          </li>
        ))}
      </ul>

      {selectedToken && (
        <TradeDrawer
          open={isDrawerOpen}
          onOpenChange={(open) => {
            setIsDrawerOpen(open);
            if (!open) {
              setSelectedToken(null);
            }
          }}
          tokenFrom={tokens.find((t) => t.symbol === 'USDC') || tokens[1]}
          tokenTo={selectedToken}
          onSwap={handleSwap}
        />
      )}
    </div>
  );
}
