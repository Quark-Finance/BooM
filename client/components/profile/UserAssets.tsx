// components/profile/UserAssets.tsx

import React from 'react';
import Image from 'next/image';

interface Token {
  name: string;
  symbol: string;
  price: number;
  balance: number;
  icon: string;
}

interface UserAssetsProps {
  tokens: Token[];
}

export default function UserAssets({ tokens }: UserAssetsProps) {
  return (
    <ul className="space-y-4">
      {tokens.map((token) => (
        <li
          key={token.symbol}
          className="rounded-lg p-4 flex items-center justify-between bg-secondary/10"
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
              <p className="text-sm text-gray-500">{token.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">${(token.balance * token.price).toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {token.balance.toFixed(4)} {token.symbol}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
