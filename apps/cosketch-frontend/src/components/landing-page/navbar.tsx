import React from 'react';
import { NavLink } from '@/data/navLink';
import MobileNav from './mobile-nav';
import siteMetadata from '@/lib/siteMetadata';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <ul className='hidden items-center gap-8 md:flex'>
        {NavLink.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className='text-sm font-medium text-[#7a7770] transition-colors hover:text-[#1a1916]'
            >
              {link.title}
            </a>
          </li>
        ))}

        <li>
          <a
            href={siteMetadata.github}
            target='_blank'
            className='text-sm font-medium text-[#7a7770] transition-colors hover:text-[#1a1916]'
          >
            Github
          </a>
        </li>

        <li>
          <Link
            href='/signin'
            scroll={false}
            className='rounded-lg bg-[#1a1916] px-5 py-2 text-sm font-semibold text-[#f9f6ef] transition-colors hover:bg-[#2d2c26]'
          >
            Sign In
          </Link>
        </li>
      </ul>
      <MobileNav />
    </nav>
  );
};

export default Navbar;
