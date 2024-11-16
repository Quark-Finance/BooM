'use client'

import Image from 'next/image';

interface Token {
  name: string;
  symbol: string;
  price: number;
  balance: number;
  icon: string;
}

export default function UserAssets() {
  const tokens: Token[] = [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      price: 1.0,
      icon: '/icons/usdc.png',
      balance: 43.67,
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
    }
  ];

  // Function to calculate the balance in USD for each token
  const getBalanceInUSD = (token: Token) => {
    return token.balance * token.price;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <ul className="space-y-4">
        {tokens.map((token) => (
          <li
            key={token.symbol}
            className="cursor-pointer hover:bg-secondary/10 transition-colors rounded-lg p-4 flex items-center justify-between"
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
              {/* Display balance in USD */}
              <p className="text-lg text-primary">
                ${getBalanceInUSD(token).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {token.balance.toFixed(2)} {token.symbol}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
