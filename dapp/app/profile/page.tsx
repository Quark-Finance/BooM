'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccount, useBalance, useEnsName, useEnsAvatar } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Activity, Settings } from 'lucide-react';
import { Meteors } from '@/components/ui/meteors';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background/50 text-foreground">
      <Meteors number={20} />
      <div className="container mx-auto py-8 px-4 z-10 relative">
        <h1 className="text-4xl font-bold mb-8 text-primary">Profile</h1>

        {!isConnected ? (
          <Card className="mb-8">
            <CardContent className="flex items-center justify-center p-6">
              <ConnectButton />
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                  {ensAvatar ? (
                    <Image src={ensAvatar} alt="ENS Avatar" width={80} height={80} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                      {address ? address.slice(2, 4).toUpperCase() : ''}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {ensName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '')}
                  </h2>
                  <p className="text-muted-foreground">
                    {balance?.formatted} {balance?.symbol}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="wallet" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="wallet">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Wallet Information */}
              <TabsContent value="wallet">
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Address:</strong> {address}
                    </p>
                    <p>
                      <strong>Balance:</strong> {balance?.formatted} {balance?.symbol}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>No recent activity to display.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Settings content goes here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <ConnectButton />
          </>
        )}
      </div>
    </div>
  );
}
