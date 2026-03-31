'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useRooms } from '@/hooks/useRooms';
import { toast } from 'react-hot-toast';
import { fraunces } from '@/data/fonts';

interface CreateRoomDialogBoxProps {
  onClose: (e: boolean) => void;
}

const CreateRoomDialogBox = ({ onClose }: CreateRoomDialogBoxProps) => {
  const [roomName, setRoomName] = useState('');
  const { createRoom } = useRooms();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      inputRef.current?.focus();
      return;
    }
    onClose(false);
    setRoomName('');
    toast.promise(
      createRoom(roomName),
      {
        loading: 'Creating room…',
        success: 'Room created!',
        error: err => err.message || 'Failed to create room',
      },
      {
        style: {
          background: '#1a1916',
          color: '#f9f6ef',
          borderRadius: '10px',
          padding: '12px 18px',
          fontSize: '13px',
        },
        position: 'top-center',
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateRoom();
    if (e.key === 'Escape') onClose(false);
  };

  return (
    <section
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#1a1916]/40 backdrop-blur-sm'
      onClick={() => onClose(false)}
    >
      <div
        className='w-[90%] max-w-sm overflow-hidden rounded-2xl bg-[#f9f6ef] shadow-2xl shadow-[#1a1916]/20'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='relative border-b border-[#e8e2d4] px-6 pb-5 pt-6'>
          {/* small decorative mark */}
          <div className='mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a1916]'>
            <Plus className='h-4 w-4 text-[#f9f6ef]' />
          </div>
          <h2 className={`${fraunces.className} text-xl font-semibold text-[#1a1916]`}>
            New Room
          </h2>
          <p className='mt-0.5 text-xs text-[#7a7770]'>
            Give your collaborative canvas a name.
          </p>
          <button
            onClick={() => onClose(false)}
            className='absolute right-5 top-5 rounded-lg p-1.5 text-[#b8b4ab] transition-colors hover:bg-[#e8e2d4] hover:text-[#1a1916]'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5'>
          <label className='mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#b8b4ab]'>
            Room Name
          </label>
          <input
            ref={inputRef}
            type='text'
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g. Product Brainstorm'
            className='w-full rounded-xl border border-[#e8e2d4] bg-white px-4 py-2.5 text-sm text-[#1a1916] placeholder-[#c8c4bb] outline-none transition-colors focus:border-[#1a1916] focus:ring-2 focus:ring-[#1a1916]/8'
          />
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
            onClick={handleCreateRoom}
            disabled={!roomName.trim()}
            className='flex items-center gap-1.5 rounded-xl bg-[#1a1916] px-4 py-2 text-xs font-semibold text-[#f9f6ef] transition-colors hover:bg-[#2d2c26] disabled:cursor-not-allowed disabled:opacity-40'
          >
            <Plus className='h-3.5 w-3.5' />
            Create Room
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateRoomDialogBox;
