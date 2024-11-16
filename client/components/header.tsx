import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-primary text-secondary shadow-md z-50 flex justify-center items-center h-16">
      <h1 className="text-2xl font-bold">👻 BooMarket</h1>
    </header>
  );
};

export default Header;
