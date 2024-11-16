// components/RaffleSection.tsx
'use client';

import { useState } from 'react';

interface RaffleProps {
  totalBoom: number;
  setTotalBoom: React.Dispatch<React.SetStateAction<number>>;
}

export default function RaffleSection({ totalBoom, setTotalBoom }: RaffleProps) {
  const [message, setMessage] = useState('');

  const handleBuyWithBoom = () => {
    if (totalBoom >= 100) {
      setTotalBoom((prevBoom) => prevBoom - 100);
      setMessage('You have successfully purchased a raffle ticket with 100 BOOM!');
    } else {
      setMessage('Insufficient BOOM points to purchase a raffle ticket.');
    }
  };

  const handleBuyWithUSDC = () => {
    // Implement USDC purchase logic here
    setMessage('You have successfully purchased a raffle ticket with 5 USDC!');
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
      {message && <p className="mt-4 text-sm text-green-500">{message}</p>}
    </div>
  );
}
