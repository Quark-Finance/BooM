// components/market/tradeSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import TradeDrawer from '@/components/market/trade-drawer';

interface Token {
  name: string;
  symbol: string;
  price: number;
  balance: number;
  icon: string;
}

interface tradeSectionProps {
  initialTokens: Token[];
}

export default function tradeSection({ initialTokens }: tradeSectionProps) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
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
    <>
      <h2 className="text-2xl font-bold p-4">Buy and Sell Tokens</h2>
      <ul className="space-y-4 px-4">
        {tokens.map((token) => (
          <li
            key={token.symbol}
            className="cursor-pointer border border-gray-200 shadow-sm hover:bg-secondary/10 transition-colors rounded-lg p-4 flex items-center justify-between"
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
              <p className="text-sm text-muted-foreground">
                Balance: {token.balance.toFixed(4)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Trade Drawer for Interactable Tokens */}
      {selectedToken && (
        <TradeDrawer
          open={isDrawerOpen}
          onOpenChange={(open) => {
            setIsDrawerOpen(open);
            if (!open) {
              setSelectedToken(null);
            }
          }}
          tokenFrom={tokens.find((t) => t.symbol === 'USDC') || tokens[0]}
          tokenTo={selectedToken}
          onSwap={handleSwap}
        />
      )}
    </>
  );
}
