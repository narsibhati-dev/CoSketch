import React from 'react';
import Link from 'next/link';
import { fraunces } from '@/data/fonts';

interface LogoProps {
  light?: boolean;
  size?: 'sm' | 'md';
}

const Logo = ({ light = false, size = 'md' }: LogoProps) => {
  const markSize = size === 'sm' ? 26 : 30;
  const textSize = size === 'sm' ? 'text-lg' : 'text-xl';

  // on light bg: dark ink square  |  on dark bg: cream square
  const markBg = light ? '#f9f6ef' : '#1a1916';
  const frameLine = light ? 'rgba(26,25,22,0.25)' : 'rgba(249,246,239,0.2)';
  const wordPrimary = light ? '#f9f6ef' : '#1a1916';
  const wordSecondary = light ? 'rgba(249,246,239,0.5)' : '#9a9690';

  return (
    <Link className='flex items-center gap-2.5' href='/' scroll={false}>
      {/* ── Mark ── */}
      <svg
        width={markSize}
        height={markSize}
        viewBox='0 0 30 30'
        fill='none'
        aria-hidden='true'
      >
        <rect width='30' height='30' rx='7' fill={markBg} />
        <rect x='6' y='6' width='18' height='18' rx='2.5' stroke={frameLine} strokeWidth='1.2' fill='none' />
        <path
          d='M8 17 C 11 13, 14 20, 17 16 S 20 11, 23 14'
          stroke='#e04e1f'
          strokeWidth='1.8'
          strokeLinecap='round'
          fill='none'
        />
        <circle cx='23' cy='14' r='1.2' fill='#e04e1f' />
      </svg>

      {/* ── Wordmark ── */}
      <span className={`${fraunces.className} ${textSize} font-semibold tracking-tight`}>
        <em className='not-italic' style={{ color: wordPrimary }}>Co</em>
        <em className='italic' style={{ color: wordSecondary }}>Sketch</em>
      </span>
    </Link>
  );
};

export default Logo;
