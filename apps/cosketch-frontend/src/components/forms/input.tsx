'use client';

import { EyeOff, Eye } from 'lucide-react';
import React, { useState } from 'react';

interface InputProps {
  title: string;
  placeholder: string;
  type: string;
  required: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: 'name' | 'email';
}

export const Input = ({
  type,
  title,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  autoComplete,
}: InputProps) => {
  return (
    <div>
      <label className='mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#7a7770]'>
        {title}
        {required && <span className='ml-0.5 text-[#e04e1f]'>*</span>}
      </label>
      <input
        type={type}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1a1916] placeholder:text-[#c8c4bc] transition-all duration-150 focus:outline-none focus:ring-2 ${
          error
            ? 'border-[#e04e1f]/40 focus:border-[#e04e1f]/40 focus:ring-[#e04e1f]/15'
            : 'border-[#e8e2d4] focus:border-[#1a1916]/20 focus:ring-[#1a1916]/6'
        }`}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      {error && (
        <p className='mt-1.5 text-xs text-[#e04e1f]'>{error}</p>
      )}
    </div>
  );
};

interface InputPasswordProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete: 'new-password' | 'current-password';
}

export const InputPassword = ({
  title,
  value,
  onChange,
  placeholder = 'Enter password',
  required = false,
  error,
  autoComplete,
}: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className='mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#7a7770]'>
        {title}
        {required && <span className='ml-0.5 text-[#e04e1f]'>*</span>}
      </label>
      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-[#1a1916] placeholder:text-[#c8c4bc] transition-all duration-150 focus:outline-none focus:ring-2 ${
            error
              ? 'border-[#e04e1f]/40 focus:border-[#e04e1f]/40 focus:ring-[#e04e1f]/15'
              : 'border-[#e8e2d4] focus:border-[#1a1916]/20 focus:ring-[#1a1916]/6'
          }`}
          placeholder={placeholder}
          required={required}
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
        />
        <button
          type='button'
          onClick={() => setShowPassword(prev => !prev)}
          className='absolute inset-y-0 right-0 flex items-center px-3 text-[#c8c4bc] transition-colors hover:text-[#7a7770] focus:outline-none'
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className='h-4 w-4' />
          ) : (
            <Eye className='h-4 w-4' />
          )}
        </button>
      </div>
      {error && (
        <p className='mt-1.5 text-xs text-[#e04e1f]'>{error}</p>
      )}
    </div>
  );
};
