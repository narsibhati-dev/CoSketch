'use client';

import React, { useState } from 'react';
import { LogoutDialogBox } from '@/components/dialogbox/logout-dialogbox';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <>
      <LogoutDialogBox isOpen={dialogOpen} onClose={setDialogOpen} />
      <button
        className='flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e8e2d4] px-3.5 py-2 text-sm font-medium text-[#7a7770] transition-colors hover:border-[#1a1916]/25 hover:text-[#1a1916]'
        onClick={() => setDialogOpen(true)}
      >
        <LogOut size={14} />
        Sign out
      </button>
    </>
  );
};

export default Logout;
