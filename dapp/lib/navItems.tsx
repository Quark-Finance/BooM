import React from 'react';
import { Home, Settings, User } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
  { label: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];