import React from 'react';
import siteMetadata from '@/lib/siteMetadata';
import CardSocial from './card-social';
import Logo from './logo';
import { fraunces } from '@/data/fonts';

const Footer = () => {
  const productLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Demo Video', href: '#demo' },
  ];

  return (
    <footer className='bg-[#141410] text-white/50'>

      {/* Main footer content */}
      <section className='mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 md:flex-row md:justify-between md:gap-0'>

        {/* Brand column */}
        <section className='flex w-full flex-col items-start md:w-64'>
          <Logo light />
          <p
            className={`${fraunces.className} mt-5 text-lg font-medium italic leading-snug text-white/25`}
          >
            Sketch Together,
            <br />
            Think Better.
          </p>
          <section className='mt-6 flex gap-2.5'>
            <CardSocial title='Twitter' href={siteMetadata.twitter} />
            <CardSocial title='Github' href={siteMetadata.github} />
            <CardSocial title='LinkedIn' href={siteMetadata.linkedIn} />
          </section>
        </section>

        {/* Product links */}
        <section>
          <h3 className='mb-5 text-[10px] font-semibold uppercase tracking-widest text-white/40'>
            Product
          </h3>
          <ul className='space-y-3.5'>
            {productLinks.map(link => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className='text-sm transition-colors duration-200 hover:text-white'
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h3 className='mb-5 text-[10px] font-semibold uppercase tracking-widest text-white/40'>
            Contact
          </h3>
          <ul className='space-y-3.5'>
            <li>
              <a
                href={`mailto:${siteMetadata.email}`}
                className='text-sm transition-colors duration-200 hover:text-white'
              >
                {siteMetadata.email}
              </a>
            </li>
            <li>
              <a
                href={siteMetadata.github}
                target='_blank'
                className='text-sm transition-colors duration-200 hover:text-white'
              >
                GitHub &rarr;
              </a>
            </li>
          </ul>
        </section>
      </section>

      {/* Bottom bar */}
      <section className='border-t border-white/[0.06] px-6 py-5'>
        <div className='mx-auto flex max-w-7xl items-center justify-between'>
          <p className='text-xs text-white/20'>
            &copy; {new Date().getFullYear()} {siteMetadata.header}. All rights reserved.
          </p>
          <span className='h-1.5 w-1.5 rounded-full bg-[#e04e1f]/40' />
        </div>
      </section>
    </footer>
  );
};

export default Footer;
