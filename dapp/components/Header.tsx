'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeColorToggle } from '@/components/themeToggle/ThemeColorToggle';
import { ThemeModeToggle } from '@/components/themeToggle/ThemeModeToggle';
import { navItems } from '@/lib/navItems';
import { ConnectButton } from '@rainbow-me/rainbowkit';

type HeaderProps = {
  logo?: string;
  actions?: React.ReactNode;
};

export const Header = React.memo(function Header({ actions }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 px-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src='/logo.svg' alt="Logo" width={32} height={32} className="dark:invert dark:drop-shadow-[0_0_0.3rem_#ffffff70]" />
          <span className="hidden font-bold text-3xl sm:inline-block dark:drop-shadow-[0_0_0.6rem_#ffffff70]">Boo Market</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href ? 'text-primary font-semibold' : 'text-foreground/60'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav> */}
          <div className="flex items-center space-x-2">
            {actions}
            <ThemeColorToggle />
            <ThemeModeToggle />
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {connected ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={openChainModal}
                          className="bg-primary text-foreground font-semibold px-3 py-2 rounded-md text-sm"
                        >
                          {chain.name}
                        </button>
                        <button
                          onClick={openAccountModal}
                          className="bg-muted px-3 py-2 rounded-md text-sm"
                        >
                          {account.displayName}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={openConnectModal}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90"
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
          <Button variant="ghost" className="md:hidden" size="sm" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col space-y-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 transition-colors hover:text-foreground/80',
                  pathname === item.href ? 'text-primary font-semibold' : 'text-foreground/60'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
});