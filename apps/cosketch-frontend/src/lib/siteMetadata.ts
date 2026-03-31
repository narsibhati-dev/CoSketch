import { envSiteUrl } from '@/config';

if (!envSiteUrl) {
  throw new Error(
    '❌ NEXT_PUBLIC_SITE_URL is missing or empty! Check your .env file.',
  );
}

const SITE_URL = envSiteUrl.replace(/\/$/, '');

const siteMetadata = {
  title: 'COSKETCH',
  description:
    'A real-time collaborative sketching tool for teams to brainstorm, draw, and create together.',

  header: 'COSKETCH',

  slogan: `Sketch Together, Think Better`,

  developer: 'Narsi Bhati',

  siteUrl: SITE_URL,

  language: 'en-US',
  locale: 'en-US',

  socialBanner: `${SITE_URL}/images/social-banner.webp`,

  // social links
  github: 'https://github.com/narsibhati-dev/cosketch',
  linkedIn: 'https://www.linkedin.com/in/narsibhati/',
  twitter: 'https://x.com/narsihq',

  // contacts
  email: 'narsibhati2000@gmail.com',
};

export default siteMetadata;
