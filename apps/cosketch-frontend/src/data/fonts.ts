import { Fraunces, DM_Sans, Knewave } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700'],
});

export const knewave = Knewave({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-knewave',
  weight: '400',
});
