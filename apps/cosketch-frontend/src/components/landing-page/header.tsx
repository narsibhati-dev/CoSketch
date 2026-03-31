'use client';

import React, { useState, useEffect } from 'react';
import Logo from './logo';
import Navbar from './navbar';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[#e8e2d4] bg-[#f9f6ef]/95 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <section className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        <Logo />
        <Navbar />
      </section>
    </header>
  );
};

export default Header;
