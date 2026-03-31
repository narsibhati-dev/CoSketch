'use client';

import { LogOut } from 'lucide-react';
import React, { useState } from 'react';
import Tooltip from './toolbar/tooltip';
import ConfirmationDialog from '../dialogbox/confirmation-dialog';
import { CanvasMessage } from '@/hooks/useSocket';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  roomId: string;
  sendMessage: (message: CanvasMessage) => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ roomId, sendMessage }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleLeaveClick = () => {
    setIsDialogOpen(true);
  };

  const confirmLeave = () => {
    sendMessage({ type: 'room:leave', room: roomId });
    router.push('/dashboard');
    setIsDialogOpen(false);
  };

  const cancelLeave = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className='group relative'>
        <button
          className='canvas-panel canvas-btn flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2'
          onClick={handleLeaveClick}
        >
          <LogOut size={16} className='h-4 w-4' />
          <Tooltip tooltip='leave room' />
        </button>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title='Leave Room'
        message='Are you sure you want to leave the room?'
        confirmText='Leave'
        cancelText='Cancel'
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </>
  );
};

export default LogoutButton;
