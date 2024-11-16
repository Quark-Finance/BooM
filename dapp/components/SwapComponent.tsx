'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowDownUp } from 'lucide-react';
import Image from 'next/image';
import { useAccount, useBalance } from 'wagmi';
import { createPublicClient, createWalletClient, custom, formatUnits, http, parseEther, parseUnits } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { ArbitrumContract } from '@/lib/contractAddresses';

const PRIVATE_KEY = process.env.PRIVATE_KEY! as `0x${string}`;
const RPC_URL = process.env.RPC_URL;

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
  // Add more tokens as needed
];
export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http()
})

export const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum!)
})

  
async function swapTokens() {
  // Initialize the wallet client using the RPC URL and private key
  const [account] = await walletClient.getAddresses();

  // Define the contract address and ABI
  const contractAddress = '0x7b59080B27A659AEC847121De8eb402024F4bE48';
  const Swap = [
    {
      inputs: [
        { internalType: 'address', name: '_inputOFT', type: 'address' },
        { internalType: 'address', name: '_outputOFT', type: 'address' },
        { internalType: 'uint32', name: '_targetEid', type: 'uint32' },
        { internalType: 'uint256', name: '_amount', type: 'uint256' },
      ],
      name: 'swapTokenOn',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
  ];

  const inputOFT = '0x6fD36fd6D6f1D8a5E43B33b1881fd4EF167b6588';
  const outputOFT = '0xbA397eFEF3914aB025F7f5706fADE61f240A9EbC';
  const targetEid = 40232;
  const amount = parseEther('1'); 
  const value = parseEther('0.005');

  try {
    // Call the swapTokenOn function
    const txHash = await walletClient.writeContract({
      address: ArbitrumContract, 
      abi: Swap,
      functionName: 'swapTokenOn',
      args: [inputOFT, outputOFT, targetEid, amount],  
      value,
      account,
  });

    console.log(`Transaction sent! Hash: ${txHash}`);
    return txHash;
  } catch (error) {
    console.error('Error during contract interaction:', error);
    return
  }
}

export default function SwapComponent() {
  const { address, isConnected } = useAccount();

  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellToken, setSellToken] = useState(tokens[0]);
  const [buyToken, setBuyToken] = useState<Token | null>(null);
  const [sellTokenBalance, setSellTokenBalance] = useState('0');
  const [isValidSwap, setIsValidSwap] = useState(false);

  // Fetch balance of the selected sell token
  const { data: balanceData } = useBalance({
    address,
    token: sellToken.address !== '0x0000000000000000000000000000000000000000' ? sellToken.address : undefined,
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
      const amount =
        (parseFloat(sellAmount) * exchangeRate).toFixed(buyToken.decimals);
      setBuyAmount(amount);
    } else {
      setBuyAmount('');
    }
  }, [sellAmount, buyToken]);

  // Validate the swap
  useEffect(() => {
    const sellAmountBigInt = parseUnits(sellAmount || '0', sellToken.decimals);
    const balanceBigInt = parseUnits(sellTokenBalance || '0', sellToken.decimals);

    if (sellAmountBigInt <= balanceBigInt && sellAmountBigInt > 0 && buyToken) {
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

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6">
      <div className="">
      <Card className="w-full max-w-[464px] p-6 bg-muted/80 rounded-lg">
          {/* Sell Section */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-md font-bold">Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="flex-1 text-3xl font-semibold h-14 rounded-md bg-muted/80"
              />
              <Select
                value={sellToken.symbol}
                onValueChange={(value) => {
                  const selectedToken = tokens.find((t) => t.symbol === value);
                  if (selectedToken) setSellToken(selectedToken);
                }}
              >
                <div className='flex flex-col items-left text-left'>
                <SelectTrigger className="w-[150px] h-14 rounded-full border focus:ring focus:ring-primary">
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
              <span className="text-sm ml-2 mt-1 text-muted-foreground">
                {parseFloat(sellTokenBalance).toFixed(4)}{' '}
                {sellToken.symbol}
              </span>
              </div>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-1">
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
          </Card>
          {/* Swap Button */}
          <div className="relative w-full flex items-center justify-center my-1">
    <div className="absolute z-50 flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-md bg-muted/80 border border-background border-[2px] hover:bg-muted/80"
        onClick={handleTokenSwap}
      >
        <ArrowDownUp className="h-5 w-5" />
      </Button>
    </div>
  </div>
          {/* Buy Section */}
          <Card className="w-full max-w-[464px] mt-2 p-6 border border-muted/80 rounded-lg shadow-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-md font-bold">Buy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className='flex flex-col text-left items-left'>
              <Input
                type="number"
                placeholder="0"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="flex-1 text-3xl font-semibold h-14 rounded-md"
                disabled
              />
              <span className="text-sm ml-2 mt-1 text-muted-foreground">
                {parseFloat(buyAmount === '' ? '0' : buyAmount).toFixed(2) || 0}{' '}
                {buyToken?.symbol}
              </span>
              </div>
              <Select
                value={buyToken?.symbol || ''}
                onValueChange={(value) => {
                  const selectedToken = tokens.find((t) => t.symbol === value);
                  if (selectedToken) setBuyToken(selectedToken);
                }}
              >
                <SelectTrigger className="w-[150px] h-14 rounded-full border focus:ring focus:ring-primary">
                  <SelectValue placeholder="Select token">
                    {buyToken ? (
                      <div className="flex items-center gap-1">
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
          </Card>

          {/* Swap Button */}
          <Button
            className="w-full h-14 mt-2 text-lg bg-primary font-bold text-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => await swapTokens()}
            disabled={!isValidSwap || !isConnected}
          >
            {isConnected ? 'Swap' : 'Connect Wallet'}
          </Button>
        </div>
    </div>
  );
}
