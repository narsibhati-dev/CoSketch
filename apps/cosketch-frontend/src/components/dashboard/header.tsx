'use client';

import React, { useState } from 'react';
import Logo from '@/components/landing-page/logo';
import { LogoutDialogBox } from '@/components/dialogbox/logout-dialogbox';
import { LogOut } from 'lucide-react';

const DashboardHeader = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <LogoutDialogBox isOpen={dialogOpen} onClose={setDialogOpen} />

      <header className='fixed inset-x-0 top-0 z-50 h-14 border-b border-[#e8e2d4]/80 bg-[#f9f6ef]/90 backdrop-blur-md'>
        <div className='mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6'>

          <Logo />

          {/* right side */}
          <button
            onClick={() => setDialogOpen(true)}
            className='group flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-[#7a7770] transition-colors hover:bg-[#1a1916]/5 hover:text-[#1a1916]'
          >
            <LogOut
              size={15}
              className='transition-transform duration-150 group-hover:-translate-x-0.5'
            />
            <span>Sign out</span>
          </button>

        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
