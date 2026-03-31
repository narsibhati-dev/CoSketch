'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
  primary = false,
}) => {
  return (
    <button
      type='button'
      className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        primary
          ? 'border-[#1a1916]/10 bg-[#1a1916] text-white hover:bg-[#2d2c26]'
          : 'border-[#e8e2d4] bg-white text-[#1a1916] hover:border-[#1a1916]/20'
      }`}
      onClick={onClick}
      aria-label={title}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          primary ? 'bg-white/10' : 'bg-[#f9f6ef]'
        }`}
      >
        {icon}
      </span>
      <div className='flex-1'>
        <h3
          className={`text-sm font-semibold ${primary ? 'text-white' : 'text-[#1a1916]'}`}
        >
          {title}
        </h3>
        <p
          className={`mt-0.5 text-xs ${primary ? 'text-white/55' : 'text-[#7a7770]'}`}
        >
          {description}
        </p>
      </div>
      <ArrowRight
        className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
          primary ? 'text-white/40' : 'text-[#b8b4ab]'
        }`}
      />
    </button>
  );
};

export default ActionCard;
