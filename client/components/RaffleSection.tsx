// components/RaffleSection.tsx
'use client';

import { toast } from 'react-toastify';

interface RaffleProps {
  totalBoom: number;
  setTotalBoom: React.Dispatch<React.SetStateAction<number>>;
}

export default function RaffleSection({ totalBoom, setTotalBoom }: RaffleProps) {

  const handleBuyWithBoom = () => {
    if (totalBoom >= 100) {
      setTotalBoom((prevBoom) => prevBoom - 100);
      toast.success("Raffle Ticket Purchased");
    } else {
      toast.error("Insufficient BOOM Points");
    }
  };

  const handleBuyWithUSDC = () => {
    // Implement USDC purchase logic here
    toast.info("USDC Purchase Coming Soon");
  };

  return (
    <div className="mt-8 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-background">
      <h2 className="text-xl font-bold mb-4">🎟️ Raffle</h2>
      <p className="mb-4">Buy a raffle ticket for a chance to win exciting prizes!</p>
      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold"
          onClick={handleBuyWithBoom}
        >
          Buy with 100 BOOM
        </button>
        <button
          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold"
          onClick={handleBuyWithUSDC}
        >
          Buy with 5 USDC
        </button>
      </div>
    </div>
  );
}
