// components/TrendingCoins.tsx
'use client';

import useSWR from 'swr';
import Image from 'next/image';
import Marquee from '@/components/ui/marquee';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Coin {
  name: string;
  symbol: string;
  price: number;
  icon: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TrendingCoins() {
  const { data, error } = useSWR('/api/fetch-trending', fetcher);

  if (error) {
    console.error('Error fetching trending coins:', error);
    return <div>Error loading trending coins.</div>;
  }

  if (!data) {
    // Display skeleton loaders
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold p-4">Trending Coins</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {[...Array(5)].map((_, index) => (
            <SkeletonCoinCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Map the trending coins data
  const coins: Coin[] = data.data.map((item: any) => ({
    name: item.CoinInfo.FullName,
    symbol: item.CoinInfo.Name,
    price: parseFloat(item.RAW.USD.PRICE),
    icon: `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}`,
  }));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold p-4">Trending Coins</h2>
      <Marquee className="[--duration:45s] space-x-6">
        {coins.map((coin) => (
          <div
            key={coin.symbol}
            className={cn(
              'min-w-[160px] rounded-lg p-4 flex-shrink-0',
              'border border-gray-200 shadow-sm dark:border-gray-700',
              'cursor-pointer hover:bg-gray-700 transition-colors'
            )}
          >
            <div className="flex items-center space-x-2">
              <Image
                src={coin.icon}
                alt={coin.name}
                width={42}
                height={42}
                className="rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{coin.name}</h3>
                <p className="text-sm text-gray-500">{coin.symbol}</p>
              </div>
            </div>
            <p className="mt-2 text-lg font-semibold">${coin.price.toFixed(2)}</p>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

function SkeletonCoinCard() {
  return (
    <div className="min-w-[160px] bg-white rounded-lg p-4 flex-shrink-0 border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-42" />
          <Skeleton className="h-4 w-16 mt-1" />
        </div>
      </div>
      <Skeleton className="mt-2 h-6 w-20" />
    </div>
  );
}
