import React from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 justify-center w-full bg-primary bg-opacity-50 shadow-md dark:bg-background/90 text-black dark:text-white z-50 flex items-center h-12">
      <Image src='/logo.svg' alt="Logo" width={24} height={24} className="dark:invert dark:drop-shadow-[0_0_0.3rem_#ffffff70]" />
      <span className="font-bold ml-1 text-2xl inline-block dark:drop-shadow-[0_0_0.6rem_#ffffff70]">Boo Market</span>
    </header>
  );
};

export default Header;
