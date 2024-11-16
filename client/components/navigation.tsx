'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Store, History, User } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around items-center h-16">
        <Link href="/market" className={`flex flex-col items-center ${pathname === '/market' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Store size={24} />
          <span className="text-xs">Marketplace</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center ${pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}>
          <User size={24} />
          <span className="text-xs">Profile</span>
        </Link>
        <Link href="/history" className={`flex flex-col items-center ${pathname === '/history' ? 'text-primary' : 'text-muted-foreground'}`}>
          <History size={24} />
          <span className="text-xs">History</span>
        </Link>
      </div>
    </nav>
  )
}