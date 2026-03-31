'use client';

import { useState, useEffect, useRef } from 'react';
import { SidebarClose, SidebarOpen } from '@/data/icons/mobile_nav-icons';
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock';

import clsx from 'clsx';
import { NavLink } from '@/data/navLink';
import Logo from './logo';
import siteMetadata from '@/lib/siteMetadata';
import Link from 'next/link';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const onToggleNav = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    if (navRef.current) {
      if (isOpen) {
        disableBodyScroll(navRef.current, { reserveScrollBarGap: true });
        document.body.style.overflow = 'hidden';
      } else {
        enableBodyScroll(navRef.current);
        document.body.style.overflow = 'auto';
      }
    }
    return () => {
      clearAllBodyScrollLocks();
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={onToggleNav}
        className='relative z-[60] flex items-center justify-center text-[#1a1916] md:hidden'
        aria-label='Toggle Menu'
      >
        {isOpen ? <SidebarClose /> : <SidebarOpen />}
      </button>

      {isOpen && (
        <div
          className='fixed inset-0 z-50 bg-[#1a1916]/30 backdrop-blur-sm transition-opacity duration-300'
          onClick={onToggleNav}
        />
      )}

      <aside
        ref={navRef}
        className={clsx(
          isOpen ? 'translate-x-0' : 'translate-x-full',
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-[#f9f6ef] transition-transform duration-500',
        )}
      >
        <div
          className='flex items-center justify-between border-b border-[#e8e2d4] bg-[#f9f6ef] px-5 py-5'
          onClick={e => e.stopPropagation()}
        >
          <Logo />
        </div>

        <nav className='mt-4 flex flex-1 flex-col gap-4 overflow-y-auto bg-[#f9f6ef] px-6 pb-8'>
          <ul className='text-[#1a1916]'>
            {NavLink.map((link, index) => (
              <li key={index} className='mt-6'>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className='text-2xl font-medium text-[#7a7770] transition-colors hover:text-[#1a1916]'
                >
                  {link.title}
                </a>
              </li>
            ))}

            <li className='mt-6'>
              <a
                href={siteMetadata.github}
                target='_blank'
                onClick={() => setIsOpen(false)}
                className='text-2xl font-medium text-[#7a7770] transition-colors hover:text-[#1a1916]'
              >
                Github
              </a>
            </li>

            <li className='mt-8'>
              <Link
                href='/signin'
                scroll={false}
                className='inline-block rounded-lg bg-[#1a1916] px-6 py-3 font-semibold text-[#f9f6ef] transition-colors hover:bg-[#2d2c26]'
              >
                Sign In
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default MobileNav;
