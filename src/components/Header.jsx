// src/components/Header.js
import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="bg-green-600 text-white py-4 shadow-md text-center rounded-b-2xl">
      <h1 className="text-2xl md:text-4xl font-bold tracking-wide">{title}</h1>
    </header>
  );
};

export default Header;
