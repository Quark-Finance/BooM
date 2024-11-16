// components/trade-drawer.tsx

'use client';

import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

interface Token {
  name: string;
  symbol: string;
  price: number;
  balance: number;
  icon: string;
}

interface TradeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenFrom: Token;
  tokenTo: Token;
  onSwap: (sellAmount: number, buyAmount: number) => void;
}

export default function TradeDrawer({
  open,
  onOpenChange,
  tokenFrom,
  tokenTo,
  onSwap,
}: TradeDrawerProps) {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('buy');

  useEffect(() => {
    calculateToAmount(fromAmount);
  }, [activeTab]);

  useEffect(() => {
    if (!open) {
      // Reset the form when the drawer is closed
      setFromAmount('');
      setToAmount('');
      setError('');
      setActiveTab('buy');
    }
  }, [open]);

  const calculateToAmount = (value: string) => {
    const fromAmountNum = parseFloat(value);
    if (!isNaN(fromAmountNum)) {
      const toAmountNum = activeTab === 'buy'
        ? fromAmountNum / tokenTo.price
        : fromAmountNum * tokenTo.price;
      setToAmount(toAmountNum.toFixed(6));
    } else {
      setToAmount('');
    }
  };

  const calculateFromAmount = (value: string) => {
    const toAmountNum = parseFloat(value);
    if (!isNaN(toAmountNum)) {
      const fromAmountNum = activeTab === 'buy'
        ? toAmountNum * tokenTo.price
        : toAmountNum / tokenTo.price;
      setFromAmount(fromAmountNum.toFixed(6));
    } else {
      setFromAmount('');
    }
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    calculateToAmount(value);

    const fromAmountNum = parseFloat(value);
    if (!isNaN(fromAmountNum)) {
      if (activeTab === 'buy' && fromAmountNum > tokenFrom.balance) {
        setError(`Insufficient ${tokenFrom.symbol} balance`);
      } else if (activeTab === 'sell' && fromAmountNum > tokenTo.balance) {
        setError(`Insufficient ${tokenTo.symbol} balance`);
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);
    calculateFromAmount(value);
  };

  const isValid = fromAmount && parseFloat(fromAmount) > 0 && !error;

  const handleSwap = () => {
    if (isValid) {
      const fromAmountNum = parseFloat(fromAmount);
      const toAmountNum = parseFloat(toAmount);
      if (activeTab === 'buy') {
        onSwap(fromAmountNum, toAmountNum);
      } else {
        onSwap(toAmountNum, fromAmountNum);
      }
      // Close the drawer after swap
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold">
              Trade {tokenTo.name}
            </DrawerTitle>
          </DrawerHeader>
          <Tabs defaultValue="buy" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 p-1">
              <TabsTrigger
                value="buy"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger
                value="sell"
                className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800"
              >
                Sell
              </TabsTrigger>
            </TabsList>
            <div className="p-4 space-y-6">
              <TabsContent value="buy" className="space-y-4">
                <div className="text-2xl font-bold text-green-600">BUY</div>
                <TokenInput
                  amount={toAmount}
                  onAmountChange={handleToAmountChange}
                  token={tokenTo}
                  label="Buy"
                />
                <div className="flex justify-center">
                  <ArrowDown className="text-muted-foreground" size={24} />
                </div>
                <TokenInput
                  amount={fromAmount}
                  onAmountChange={handleFromAmountChange}
                  token={tokenFrom}
                  label="For"
                  balance={tokenFrom.balance}
                />
              </TabsContent>
              <TabsContent value="sell" className="space-y-4">
                <div className="text-2xl font-bold text-red-600">SELL</div>
                <TokenInput
                  amount={fromAmount}
                  onAmountChange={handleFromAmountChange}
                  token={tokenTo}
                  label="Sell"
                  balance={tokenTo.balance}
                />
                <div className="flex justify-center">
                  <ArrowDown className="text-muted-foreground" size={24} />
                </div>
                <TokenInput
                  amount={toAmount}
                  onAmountChange={handleToAmountChange}
                  token={tokenFrom}
                  label="For"
                />
              </TabsContent>
              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}
            </div>
            <div className="p-4">
              <Button
                className={`w-full ${isValid
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                  }`}
                disabled={!isValid}
                onClick={handleSwap}
              >
                {isValid ? `Confirm ${activeTab === 'buy' ? 'Purchase' : 'Sale'}` : 'Enter an amount'}
              </Button>
            </div>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface TokenInputProps {
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  token: Token;
  label: string;
  balance?: number;
}

function TokenInput({ amount, onAmountChange, token, label, balance }: TokenInputProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="flex items-center space-x-4 bg-secondary/50 p-4 rounded-lg">
        <Input
          type="number"
          value={amount}
          onChange={onAmountChange}
          className="text-2xl bg-transparent border-none p-0 h-auto focus-visible:ring-0 appearance-none"
          placeholder="0"
        />
        <div className="flex items-center space-x-2">
          <Image
            src={token.icon}
            alt={token.symbol}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="font-medium">{token.symbol}</span>
        </div>
      </div>
      {balance !== undefined && (
        <div className="text-sm text-muted-foreground">
          Balance: {balance.toFixed(6)} {token.symbol}
        </div>
      )}
    </div>
  );
}
