'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import useJoinRoomMutation from '@/hooks/useJoinRoom';
import { fraunces } from '@/data/fonts';

interface JoinRoomDialogBoxProps {
  onClose: (e: boolean) => void;
}

const JoinRoomDialogBox = ({ onClose }: JoinRoomDialogBoxProps) => {
  const [roomId, setRoomId] = useState('');
  const { mutate: joinRoom } = useJoinRoomMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      toast.error('Please enter a Room ID.', {
        style: { background: '#1a1916', color: '#f9f6ef', borderRadius: '10px', fontSize: '13px' },
        position: 'top-center',
      });
      inputRef.current?.focus();
      return;
    }
    onClose(false);
    joinRoom(roomId.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleJoinRoom();
    if (e.key === 'Escape') onClose(false);
  };

  return (
    <section
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#1a1916]/40 p-4 backdrop-blur-sm'
      onClick={() => onClose(false)}
    >
      <div
        className='max-h-[90vh] w-full max-w-sm overflow-hidden rounded-2xl bg-[#f9f6ef] shadow-2xl shadow-[#1a1916]/20'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='relative border-b border-[#e8e2d4] px-6 pb-5 pt-6'>
          <div className='mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e2d4] bg-white'>
            <LogIn className='h-4 w-4 text-[#7a7770]' />
          </div>
          <h2 className={`${fraunces.className} text-xl font-semibold text-[#1a1916]`}>
            Join a Room
          </h2>
          <p className='mt-0.5 text-xs text-[#7a7770]'>
            Paste a Room ID to jump into a canvas.
          </p>
          <button
            onClick={() => onClose(false)}
            className='absolute right-5 top-5 rounded-lg p-1.5 text-[#b8b4ab] transition-colors hover:bg-[#e8e2d4] hover:text-[#1a1916]'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Body */}
        <div className='max-h-[52vh] overflow-y-auto px-6 py-5'>
          <label className='mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#b8b4ab]'>
            Room ID
          </label>
          <input
            ref={inputRef}
            type='text'
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Paste room ID here…'
            className='w-full rounded-xl border border-[#e8e2d4] bg-white px-4 py-2.5 font-mono text-sm text-[#1a1916] placeholder-[#c8c4bb] outline-none transition-colors focus:border-[#1a1916] focus:ring-2 focus:ring-[#1a1916]/8'
          />
          <p className='mt-2 text-[11px] text-[#b8b4ab]'>
            You can copy a Room ID from any card on your dashboard.
          </p>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-2 border-t border-[#e8e2d4] px-6 py-4'>
          <button
            onClick={() => onClose(false)}
            className='rounded-xl border border-[#e8e2d4] px-4 py-2 text-xs font-medium text-[#7a7770] transition-colors hover:border-[#1a1916]/20 hover:text-[#1a1916]'
          >
            Cancel
          </button>
          <button
            onClick={handleJoinRoom}
            disabled={!roomId.trim()}
            className='flex items-center gap-1.5 rounded-xl bg-[#e04e1f] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#c94318] disabled:cursor-not-allowed disabled:opacity-40'
          >
            <LogIn className='h-3.5 w-3.5' />
            Join Room
          </button>
        </div>
      </div>
    </section>
  );
};

export default JoinRoomDialogBox;
