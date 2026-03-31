import React from 'react';
import ShareButton from '../share-button';
import LogoutButton from '../logoutButton';
import Toolbar from '../toolbar/toolbar';
import { CanvasMessage } from '@/hooks/useSocket';

interface HeaderProps {
  roomId: string;
  sendMessage: (message: CanvasMessage) => void;
}

const CanvasHeader = ({ roomId, sendMessage }: HeaderProps) => {
  return (
    <header className='fixed top-0 left-0 z-10 w-full bg-transparent'>
      {/* Mobile (< md): single row — Logout + Share only.
          Toolbar lives at the bottom via MobileToolbar. */}
      <div className='flex items-center justify-between px-4 py-3 md:hidden'>
        <LogoutButton roomId={roomId} sendMessage={sendMessage} />
        <ShareButton roomId={roomId} />
      </div>

      {/* Tablet + Desktop (≥ md): Logout | Toolbar (center) | Share */}
      <div className='hidden items-center justify-between px-5 py-4 md:flex lg:px-6'>
        <LogoutButton roomId={roomId} sendMessage={sendMessage} />
        <Toolbar roomId={roomId} sendMessage={sendMessage} />
        <ShareButton roomId={roomId} />
      </div>
    </header>
  );
};

export default CanvasHeader;
