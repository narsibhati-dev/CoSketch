'use client';

import React, { useState } from 'react';
import { Input, InputPassword } from '@/components/forms/input';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/forms/button';
import { CreateUserSchema } from '@repo/types';
import { signupUser } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import HashLoader from 'react-spinners/HashLoader';
import { fraunces } from '@/data/fonts';
import Logo from '@/components/landing-page/logo';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const route = useRouter();

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      toast.success('Account created! Please sign in.');
      route.push('/signin');
    },
    onError: err => {
      setEmail('');
      setPassword('');
      setName('');
      toast.error(err.message);
    },
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = CreateUserSchema.safeParse({ name, email, password });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        name: formattedErrors.name?._errors[0],
        email: formattedErrors.email?._errors[0],
        password: formattedErrors.password?._errors[0],
      });
      return;
    }

    setErrors({});
    signupMutation.mutate({ name, password, email });
  };

  return (
    <main className='flex h-screen w-screen overflow-hidden'>

      {/* ── Left Panel: Dark brand canvas ─────────────────────── */}
      <aside className='relative hidden flex-col bg-[#141410] lg:flex lg:w-[52%]'>
        {/* Cream dot grid */}
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.035]'
          style={{
            backgroundImage:
              'radial-gradient(circle, #f9f6ef 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Large sketched circle, bottom-right */}
        <div className='pointer-events-none absolute bottom-[-40px] right-[-60px] opacity-[0.06]'>
          <svg width='480' height='480' viewBox='0 0 480 480' fill='none'>
            <path
              d='M 460 240 C 458 116, 358 22, 232 26 C 110 30, 18 124, 22 248 C 26 370, 120 460, 244 458 C 366 456, 462 366, 460 242'
              stroke='#f9f6ef'
              strokeWidth='2.5'
              strokeLinecap='round'
              fill='none'
            />
            <path
              d='M 438 240 C 436 130, 346 46, 232 50 C 122 54, 42 138, 46 250 C 50 360, 136 438, 244 436 C 350 434, 440 354, 438 242'
              stroke='#f9f6ef'
              strokeWidth='1.2'
              strokeLinecap='round'
              fill='none'
              opacity='0.4'
            />
          </svg>
        </div>

        {/* Asterisk mark */}
        <div className='pointer-events-none absolute left-[10%] top-[35%] opacity-[0.06]'>
          <svg width='42' height='42' viewBox='0 0 42 42' fill='none'>
            <line x1='21' y1='2' x2='21' y2='40' stroke='#f9f6ef' strokeWidth='2' strokeLinecap='round' />
            <line x1='2' y1='21' x2='40' y2='21' stroke='#f9f6ef' strokeWidth='2' strokeLinecap='round' />
            <line x1='7' y1='7' x2='35' y2='35' stroke='#f9f6ef' strokeWidth='2' strokeLinecap='round' />
            <line x1='35' y1='7' x2='7' y2='35' stroke='#f9f6ef' strokeWidth='2' strokeLinecap='round' />
          </svg>
        </div>

        {/* Terracotta dot cluster */}
        <div className='pointer-events-none absolute right-[16%] top-[22%] opacity-[0.18]'>
          <svg width='44' height='44' viewBox='0 0 44 44' fill='none'>
            <circle cx='8' cy='8' r='3' fill='#e04e1f' />
            <circle cx='22' cy='4' r='1.8' fill='#e04e1f' />
            <circle cx='36' cy='12' r='2.5' fill='#e04e1f' />
            <circle cx='14' cy='32' r='1.5' fill='#e04e1f' />
            <circle cx='38' cy='36' r='3' fill='#e04e1f' />
          </svg>
        </div>

        {/* Panel content */}
        <div className='relative flex h-full flex-col justify-between p-12'>
          <Logo light />

          <div>
            <h2
              className={`${fraunces.className} text-5xl font-semibold leading-[1.08] text-white/65`}
            >
              Your ideas
              <br />
              <em className='text-[#e04e1f]/75'>deserve a canvas.</em>
            </h2>
            <p className='mt-5 max-w-[280px] text-sm leading-relaxed text-white/28'>
              Join teams who sketch, plan, and create together on CoSketch, the collaborative whiteboard built for deep work.
            </p>
          </div>

          <p className='text-[11px] text-white/18'>
            &copy; {new Date().getFullYear()} CoSketch. All rights reserved.
          </p>
        </div>
      </aside>

      {/* ── Right Panel: Form ─────────────────────────────────── */}
      <div className='relative flex w-full flex-col items-center justify-center bg-[#f9f6ef] px-6 lg:w-[48%]'>

        {/* Close / back to home */}
        <Link
          href='/'
          className='absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e2d4] text-[#b8b4ab] transition-all hover:border-[#1a1916]/25 hover:text-[#1a1916]'
          aria-label='Back to home'
        >
          <X size={15} />
        </Link>

        <div className='w-full max-w-[340px]'>
          {/* Heading */}
          <h1
            className={`${fraunces.className} mb-1.5 text-3xl font-semibold text-[#1a1916]`}
          >
            Create an account.
          </h1>
          <p className='mb-8 text-sm text-[#7a7770]'>
            Start collaborating on CoSketch for free
          </p>

          {/* Form */}
          <form onSubmit={handleSignup} className='space-y-5'>
            <Input
              title='Name'
              placeholder='Your full name'
              type='text'
              required
              error={errors.name ?? ''}
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete='name'
            />
            <Input
              title='Email'
              placeholder='you@example.com'
              type='email'
              required
              error={errors.email ?? ''}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete='email'
            />
            <InputPassword
              title='Password'
              placeholder='Choose a strong password'
              value={password}
              error={errors.password ?? ''}
              required
              autoComplete='new-password'
              onChange={e => setPassword(e.target.value)}
            />
            <div className='pt-1'>
              <Button
                text={
                  signupMutation.isPending ? (
                    <div className='flex justify-center'>
                      <HashLoader color='#f9f6ef' size={17} />
                    </div>
                  ) : (
                    'Create Account'
                  )
                }
                type='submit'
                disabled={signupMutation.isPending}
              />
            </div>
          </form>

          <p className='mt-6 text-center text-sm text-[#7a7770]'>
            Already have an account?{' '}
            <Link
              href='/signin'
              className='font-semibold text-[#1a1916] transition-colors hover:text-[#e04e1f]'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
