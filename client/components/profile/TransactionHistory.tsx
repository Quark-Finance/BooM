// components/profile/TransactionHistory.tsx

import React from 'react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  date: Date;
  type: 'buy' | 'sell' | 'transfer';
  token: string;
  amount: number;
  price: number;
}

const transactions: Transaction[] = [
  {
    id: '1',
    date: new Date(),
    type: 'buy',
    token: 'BTC',
    amount: 0.001,
    price: 45000,
  },
  {
    id: '2',
    date: new Date(),
    type: 'sell',
    token: 'ETH',
    amount: 0.01,
    price: 3000,
  },
  {
    id: '3',
    date: new Date(),
    type: 'transfer',
    token: 'USDC',
    amount: 100,
    price: 1,
  },
  {
    id: '4',
    date: new Date(),
    type: 'buy',
    token: 'SOL',
    amount: 1,
    price: 150,
  },
  {
    id: '5',
    date: new Date(),
    type: 'sell',
    token: 'BTC',
    amount: 0.002,
    price: 50000,
  }
  // Add more mock transactions as needed
];

export default function TransactionHistory() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between bg-secondary/10 rounded-lg p-4"
        >
          <div>
            <p className="text-sm text-gray-500">{format(transaction.date, 'MMM dd, yyyy')}</p>
            <p className="text-lg font-semibold capitalize">{transaction.type} {transaction.token}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">
              {transaction.type === 'buy' || transaction.type === 'transfer' ? '+' : '-'} {transaction.amount} {transaction.token}
            </p>
            <p className="text-sm text-gray-500">
              at ${transaction.price.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
