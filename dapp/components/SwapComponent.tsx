'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ArrowDownUp } from 'lucide-react'
import Image from 'next/image'

export default function SwapComponent() {
  const [sellAmount, setSellAmount] = useState('')
  const [buyAmount, setBuyAmount] = useState('')

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6">
      <Card className="w-full max-w-[464px] p-6 bg-background/90 rounded-lg shadow-lg backdrop-blur-md">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-sm font-medium">Sell</div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="flex-1 text-2xl h-12 bg-muted/50 rounded-md border focus:ring focus:ring-primary"
              />
              <Select defaultValue="eth">
                <SelectTrigger className="w-[150px] h-12 bg-muted/50 rounded-md border focus:ring focus:ring-primary">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full overflow-hidden w-6 h-6 bg-blue-500">
                        <Image
                          src="/placeholder.svg"
                          alt="ETH"
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>ETH</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth">ETH</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80"
            >
              <ArrowDownUp className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium">Buy</div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="flex-1 text-2xl h-12 bg-muted/50 rounded-md border focus:ring focus:ring-primary"
              />
              <Select defaultValue="select">
                <SelectTrigger className="w-[150px] h-12 bg-muted/50 rounded-md border focus:ring focus:ring-primary">
                  <SelectValue placeholder="Select token">
                    <span>Select token</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                  <SelectItem value="dai">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="w-full h-12 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Swap
          </Button>
        </div>
      </Card>
    </div>
  )
}
