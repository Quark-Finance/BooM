'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowDownUp } from 'lucide-react';
import Image from 'next/image';
import { useAccount, useBalance, usePublicClient, useWalletClient, } from 'wagmi';
import { parseUnits } from 'viem';
import { toast } from 'react-toastify';
import { ArbitrumContract } from '@/lib/contractAddresses';
import { Swap } from '../contract/swapAbi';
import { Watch } from '../contract/watchAbi';

type Token = {
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  image: string;
};

const tokens: Token[] = [
  {
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000', // Viem uses '0x0' for native ETH
    decimals: 18,
    image: '/icons/ethereum.png',
  },
  {
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606e48', // Mainnet USDC address
    decimals: 6,
    image: '/icons/usdc.png',
  },
  {
    symbol: 'PEPE',
    address: '0x6982508145454ce325ddbe47a25d4ec3d2311933', // Mainnet pepe address
    decimals: 18,
    image: '/icons/pepe.png',
  }
  // Add more tokens as needed
];

export default function SwapComponent() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellToken, setSellToken] = useState(tokens[0]);
  const [buyToken, setBuyToken] = useState<Token | null>(null);
  const [sellTokenBalance, setSellTokenBalance] = useState('0');
  const [isValidSwap, setIsValidSwap] = useState(false);

  // Fetch balance of the selected sell token
  const { data: balanceData } = useBalance({
    address,
    token:
      sellToken.address !== '0x0000000000000000000000000000000000000000'
        ? sellToken.address
        : undefined,
  });

  useEffect(() => {
    if (balanceData) {
      setSellTokenBalance(balanceData.formatted);
    } else {
      setSellTokenBalance('0');
    }
  }, [balanceData]);

  // Mock exchange rate for demonstration purposes
  const exchangeRate = 2000; // Example: 1 ETH = 2000 USDC

  // Update buy amount based on sell amount and exchange rate
  useEffect(() => {
    if (sellAmount && buyToken) {
      const amount = (
        parseFloat(sellAmount) * exchangeRate
      ).toFixed(buyToken.decimals);
      setBuyAmount(amount);
    } else {
      setBuyAmount('');
    }
  }, [sellAmount, buyToken]);

  // Validate the swap
  useEffect(() => {
    const sellAmountBigInt = parseUnits(
      sellAmount || '0',
      sellToken.decimals
    );
    const balanceBigInt = parseUnits(
      sellTokenBalance || '0',
      sellToken.decimals
    );

    if (
      sellAmountBigInt <= balanceBigInt &&
      sellAmountBigInt > 0 &&
      buyToken
    ) {
      setIsValidSwap(true);
    } else {
      setIsValidSwap(false);
    }
  }, [sellAmount, sellTokenBalance, sellToken.decimals, buyToken]);

  // Swap tokens (sell and buy tokens)
  const handleTokenSwap = () => {
    setSellToken(buyToken || tokens[0]);
    setBuyToken(sellToken);
    setSellAmount(buyAmount);
  };

  // Function to perform the swap
  async function swapTokens() {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!walletClient) {
      toast.error('Wallet client not available');
      return;
    }

    try {
      
      // Define the contract address and other variables
      const inputOFT = '0x6fD36fd6D6f1D8a5E43B33b1881fd4EF167b6588';
      const outputOFT = '0xbA397eFEF3914aB025F7f5706fADE61f240A9EbC';
      const targetEid = 40232;
      const amount = parseUnits(sellAmount, sellToken.decimals);
      const value = parseUnits('0.005', 18);
      
      // Call the swapTokenOn function
      const hash = await walletClient.writeContract({
        address: ArbitrumContract,
        abi: Swap,
        functionName: 'swapTokenOn',
        args: [inputOFT, outputOFT, targetEid, amount],
        value,
        account: address,
      });
      
      // Show a toast that the swap is initiating
      toast.info('Swap initiated');

      console.log(`Transaction sent! Hash: ${hash}`);
      toast.info(`Transaction sent! Hash: ${hash}`);

      // Optionally, wait for transaction receipt (test function)
      const receipt = await publicClient?.waitForTransactionReceipt({ hash });
      console.log('Transaction receipt:', receipt);

      // If you wait for the receipt here, you can notify the user upon confirmation
      toast.success('Swap transaction confirmed!');

    } catch (error) {
      console.error('Error during contract interaction:', error);
      toast.error('Error during contract interaction');
    }
  }

  // Use effect to watch for contract events
  useEffect(() => {
    if (!address || !publicClient) return;

    // Start watching the contract event
    const unwatch = publicClient.watchContractEvent({
      address: '0xa56F2Eb760131C39f2ddF4c6D4d245E3d5a1d796', // ARB contract address
      abi: Watch,
      eventName: 'Transfer',
      args: { to: address },
      onLogs: (logs) => {
        console.log('Swap completed!', logs);
        toast.success('Swap completed!');
      },
    });

    // Cleanup function to unwatch when component unmounts or address changes
    return () => {
      unwatch();
    };
  }, [address, publicClient]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6">
      <Card className="w-full max-w-[464px] p-6 bg-background/90 rounded-lg shadow-lg backdrop-blur-md">
        <div className="space-y-6">
          {/* Sell Section */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">You Sell</span>
              <span className="text-sm text-muted-foreground">
                Balance: {parseFloat(sellTokenBalance).toFixed(4)}{' '}
                {sellToken.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="flex-1 text-2xl h-14 bg-muted/50 rounded-md border focus:ring focus:ring-primary"
              />
              <Select
                value={sellToken.symbol}
                onValueChange={(value) => {
                  const selectedToken = tokens.find(
                    (t) => t.symbol === value
                  );
                  if (selectedToken) setSellToken(selectedToken);
                }}
              >
                <SelectTrigger className="w-[150px] h-14 bg-muted/50 rounded-md border focus:ring focus:ring-primary">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Image
                        src={sellToken.image}
                        alt={sellToken.symbol}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-cover rounded-full"
                      />
                      <span>{sellToken.symbol}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={token.image}
                          alt={token.symbol}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-cover rounded-full"
                        />
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80"
              onClick={handleTokenSwap}
            >
              <ArrowDownUp className="h-5 w-5" />
            </Button>
          </div>

          {/* Buy Section */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">You Buy</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="flex-1 text-2xl h-14 bg-muted/50 rounded-md border focus:ring focus:ring-primary"
                disabled
              />
              <Select
                value={buyToken?.symbol || ''}
                onValueChange={(value) => {
                  const selectedToken = tokens.find(
                    (t) => t.symbol === value
                  );
                  if (selectedToken) setBuyToken(selectedToken);
                }}
              >
                <SelectTrigger className="w-[150px] h-14 bg-muted/50 rounded-md border focus:ring focus:ring-primary">
                  <SelectValue placeholder="Select token">
                    {buyToken ? (
                      <div className="flex items-center gap-2">
                        <Image
                          src={buyToken.image}
                          alt={buyToken.symbol}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-cover rounded-full"
                        />
                        <span>{buyToken.symbol}</span>
                      </div>
                    ) : (
                      <span>Select token</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tokens
                    .filter((token) => token.symbol !== sellToken.symbol)
                    .map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={token.image}
                            alt={token.symbol}
                            width={24}
                            height={24}
                            className="w-6 h-6 object-cover rounded-full"
                          />
                          <span>{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Message */}
          {!isValidSwap && sellAmount && (
            <div className="text-sm text-red-500">
              Insufficient {sellToken.symbol} balance or invalid amount.
            </div>
          )}

          {/* Swap Button */}
          <Button
            className="w-full h-14 text-lg bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={swapTokens}
            disabled={!isValidSwap || !isConnected}
          >
            {isConnected ? 'Swap' : 'Connect Wallet'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
