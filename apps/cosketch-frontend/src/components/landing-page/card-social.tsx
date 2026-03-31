import React from 'react';
import { Twitter, Github, LinkedIn } from '@/data/icons/social-icon';

interface CardSocialProps {
  title: string;
  href: string;
}

const getIcon = (title: string) => {
  if (title === 'Twitter') return <Twitter />;
  if (title === 'Github') return <Github />;
  if (title === 'LinkedIn') return <LinkedIn />;
  return null;
};

const CardSocial = ({ title, href }: CardSocialProps) => {
  return (
    <a
      href={href}
      aria-label={title}
      target='_blank'
      className='rounded-lg border border-white/[0.08] bg-white/[0.05] p-2 text-white/40 transition-all duration-200 hover:border-white/15 hover:bg-white/10 hover:text-white/80'
    >
      {getIcon(title)}
    </a>
  );
};

export default CardSocial;
