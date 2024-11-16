// components/market/trendingCoins.tsx

import Image from 'next/image';

interface Coin {
  name: string;
  symbol: string;
  price: number;
  icon: string;
}

async function fetchTrendingCoins(): Promise<Coin[]> {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD`,
      {
        method: 'GET',
        headers: {
          Authorization: `Apikey ${process.env.CRYPTOCOMPARE_API_KEY}`,
        },
        // Disable caching for server-side fetching
        cache: 'no-store',
      }
    );
    const result = await response.json();
    const coins: Coin[] = result.Data.map((item: any) => ({
      name: item.CoinInfo.FullName,
      symbol: item.CoinInfo.Name,
      price: parseFloat(item.RAW.USD.PRICE),
      icon: `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}`,
    }));
    return coins;
  } catch (e) {
    console.error(`Error while fetching coin data: ${e}`);
    return [];
  }
}

export default async function TrendingCoins() {
  const coins = await fetchTrendingCoins();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Trending Coins</h2>
      {coins.length === 0 ? (
        // Skeleton loader when coins are not available
        <div className="flex space-x-4 overflow-x-auto">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-40 h-24 bg-secondary/10 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      ) : (
        <div className="flex space-x-4 overflow-x-auto">
          {coins.map((coin) => (
            <div
              key={coin.symbol}
              className="min-w-[160px] bg-secondary/10 rounded-lg p-4 flex-shrink-0"
            >
              <div className="flex items-center space-x-2">
                <Image
                  src={coin.icon}
                  alt={coin.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{coin.name}</h3>
                  <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                </div>
              </div>
              <p className="mt-2 text-lg font-semibold">${coin.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
