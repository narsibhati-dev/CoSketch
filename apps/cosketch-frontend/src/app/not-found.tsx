import Logo from '@/components/landing-page/logo';
import { knewave } from '@/data/fonts';
import React from 'react';
import Animation from '@/components/animation';
import Link from 'next/link';

const NotFound = () => {
  return (
    <>
      <header className='shadow-lg'>
        <section className='mx-auto flex max-w-7xl items-start justify-start px-4 py-4'>
          <Logo />
        </section>
      </header>
      <main className='flex h-[80vh] w-full flex-col items-center justify-center text-center'>
        <h1 className='text-6xl font-semibold'>
          <span className={`${knewave.className} tracking-widest`}>
            <Animation>404</Animation>
          </span>{' '}
          | Blank Canvas!
        </h1>
        <p className='mt-4 text-lg text-gray-600'>
          Nothing’s drawn here yet, time to create something amazing.
        </p>
        <div className='mt-8 flex gap-4'>
          <Link href='/'>
            <span className='hover:bg-primary bg-primary-darker rounded-lg px-6 py-3 font-bold tracking-wider text-white transition'>
              🎨 Start Drawing
            </span>
          </Link>
        </div>
      </main>
    </>
  );
};

export default NotFound;
