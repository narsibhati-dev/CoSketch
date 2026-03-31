import { fraunces } from '@/data/fonts';
import siteMetadata from '@/lib/siteMetadata';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f9f6ef] px-4 pb-14 pt-24 text-center sm:px-6 sm:pb-16 sm:pt-28'>

      {/* ── Decorative sketched background elements ──────────── */}

      {/* Large rough-circle, top-right */}
      <div className='pointer-events-none absolute -right-40 top-6 opacity-[0.035] sm:right-[-60px] sm:top-[8%] sm:opacity-[0.055]'>
        <svg
          className='h-80 w-80 sm:h-[520px] sm:w-[520px]'
          viewBox='0 0 520 520'
          fill='none'
          aria-hidden='true'
        >
          <path
            d='M 500 260 C 498 122, 384 18, 248 22 C 116 26, 16 132, 20 268 C 24 400, 132 498, 266 496 C 398 494, 502 390, 500 260 Z'
            stroke='#1a1916'
            strokeWidth='3'
            strokeLinecap='round'
            fill='none'
          />
          <path
            d='M 478 260 C 476 138, 372 42, 252 46 C 134 50, 44 148, 48 268 C 52 386, 150 472, 268 470 C 384 468, 480 374, 478 260 Z'
            stroke='#1a1916'
            strokeWidth='1.5'
            strokeLinecap='round'
            fill='none'
            opacity='0.5'
          />
        </svg>
      </div>

      {/* Small spark / asterisk marks */}
      <div className='pointer-events-none absolute left-4 top-16 opacity-[0.06] sm:left-[10%] sm:top-[22%] sm:opacity-[0.08]'>
        <svg
          className='h-7 w-7 sm:h-10 sm:w-10'
          viewBox='0 0 40 40'
          fill='none'
          aria-hidden='true'
        >
          <line x1='20' y1='2' x2='20' y2='38' stroke='#1a1916' strokeWidth='2' strokeLinecap='round' />
          <line x1='2' y1='20' x2='38' y2='20' stroke='#1a1916' strokeWidth='2' strokeLinecap='round' />
          <line x1='7' y1='7' x2='33' y2='33' stroke='#1a1916' strokeWidth='2' strokeLinecap='round' />
          <line x1='33' y1='7' x2='7' y2='33' stroke='#1a1916' strokeWidth='2' strokeLinecap='round' />
        </svg>
      </div>

      <div className='pointer-events-none absolute bottom-16 right-6 rotate-12 opacity-[0.055] sm:bottom-[18%] sm:right-[12%] sm:opacity-[0.07]'>
        <svg
          className='h-6 w-6 sm:h-8 sm:w-8'
          viewBox='0 0 32 32'
          fill='none'
          aria-hidden='true'
        >
          <line x1='16' y1='1' x2='16' y2='31' stroke='#1a1916' strokeWidth='2' strokeLinecap='round' />
          <line x1='1' y1='16' x2='31' y2='16' stroke='#1a1916' strokeWidth='2' strokeLinecap='round' />
          <line x1='5' y1='5' x2='27' y2='27' stroke='#1a1916' strokeWidth='2' strokeLinecap='round' />
          <line x1='27' y1='5' x2='5' y2='27' stroke='#1a1916' strokeWidth='2' strokeLinecap='round' />
        </svg>
      </div>

      {/* Squiggle accent, bottom-left */}
      <div className='pointer-events-none absolute bottom-20 left-3 opacity-[0.045] sm:bottom-[25%] sm:left-[6%] sm:opacity-[0.06]'>
        <svg
          className='h-8 w-16 sm:h-[50px] sm:w-[100px]'
          viewBox='0 0 100 50'
          fill='none'
          aria-hidden='true'
        >
          <path
            d='M 5 25 C 15 10, 25 40, 35 25 C 45 10, 55 40, 65 25 C 75 10, 85 40, 95 25'
            stroke='#1a1916'
            strokeWidth='2.5'
            strokeLinecap='round'
            fill='none'
          />
        </svg>
      </div>

      {/* Terracotta accent dot cluster top-left */}
      <div className='pointer-events-none absolute left-10 top-36 opacity-[0.10] sm:left-[15%] sm:top-[35%] sm:opacity-[0.12]'>
        <svg
          className='h-10 w-10 sm:h-[60px] sm:w-[60px]'
          viewBox='0 0 60 60'
          fill='none'
          aria-hidden='true'
        >
          <circle cx='12' cy='12' r='4' fill='#e04e1f' />
          <circle cx='30' cy='8' r='2.5' fill='#e04e1f' />
          <circle cx='48' cy='18' r='3' fill='#e04e1f' />
          <circle cx='20' cy='40' r='2' fill='#e04e1f' />
          <circle cx='44' cy='44' r='4' fill='#e04e1f' />
        </svg>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className='relative flex max-w-3xl flex-col items-center lg:max-w-4xl'>

        {/* Badge */}
        <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-[#1a1916]/12 bg-[#1a1916]/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#7a7770] sm:mb-8 sm:px-4 sm:text-xs sm:tracking-widest'>
          <span className='h-1.5 w-1.5 rounded-full bg-[#e04e1f]' />
          Real-time Collaborative Whiteboard
        </div>

        {/* Main headline */}
        <h1
          className={`${fraunces.className} text-4xl font-semibold leading-[1.08] tracking-tight text-[#1a1916] sm:text-5xl md:text-6xl xl:text-7xl`}
        >
          Sketch Together,
          <br />
          <em className='text-[#e04e1f]'>Think Better.</em>
        </h1>

        {/* Subtext */}
        <p className='mt-5 max-w-md text-sm leading-relaxed text-[#7a7770] sm:mt-7 sm:text-base md:text-lg'>
          Draw, plan, and brainstorm with your team in real-time.
          No downloads, no setup,
          <span className='font-medium text-[#1a1916]'> just open and create.</span>
        </p>

        {/* CTAs */}
        <div className='mt-8 flex w-full flex-col items-center gap-3 sm:mt-10 sm:w-auto sm:flex-row'>
          <Link
            href='/dashboard'
            className='w-full rounded-xl bg-[#1a1916] px-8 py-3 text-sm font-semibold text-[#f9f6ef] shadow-md shadow-[#1a1916]/10 transition-all hover:bg-[#2d2c26] hover:shadow-lg sm:w-auto sm:py-3.5'
          >
            Start Drawing Free
          </Link>
          <a
            href='#demo'
            className='flex w-full items-center justify-center gap-2 rounded-xl border border-[#1a1916]/15 px-8 py-3 text-sm font-semibold text-[#7a7770] transition-all hover:border-[#1a1916]/30 hover:text-[#1a1916] sm:w-auto sm:py-3.5'
          >
            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                clipRule='evenodd'
              />
            </svg>
            Watch Demo
          </a>
        </div>

        {/* Feature stats */}
        <div className='mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:mt-14 sm:gap-x-7'>
          {['Open Source', 'Real-time Sync', 'Team Workspaces', 'Cloud Storage'].map(
            (label, i) => (
              <span key={i} className='flex items-center gap-1.5 text-xs font-medium text-[#b8b4ab]'>
                <span className='h-1 w-1 rounded-full bg-[#e04e1f]/60' />
                {label}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
