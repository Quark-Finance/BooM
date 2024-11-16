import React from 'react';
import { ThemeToggle } from './themeToggle/ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-primary justify-between items-center bg-opacity-50 shadow-md dark:bg-background/90 text-secondary shadow-md z-50 flex items-center h-16">
      <h1 className="text-2xl font-bold dark: text-white ml-5">👻 BooMarket</h1>
      <div className = "mr-5">
      <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
