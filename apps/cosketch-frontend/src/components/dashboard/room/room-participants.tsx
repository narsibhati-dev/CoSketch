'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, ChevronDown } from 'lucide-react';

interface RoomParticipantProps {
  participants: string[];
  noOfParticipants: number;
  username?: string;
}

export default function RoomParticipants({
  participants,
  noOfParticipants,
  username,
}: RoomParticipantProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className='flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs text-[#b8b4ab] transition-colors hover:bg-[#f9f6ef] hover:text-[#7a7770]'
      >
        <Users className='h-3.5 w-3.5' />
        {noOfParticipants}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className='absolute left-0 z-20 mt-1.5 w-44 overflow-hidden rounded-lg border border-[#e8e2d4] bg-white shadow-lg shadow-[#1a1916]/6'>
          {participants.length > 0 ? (
            participants.map((participant, index) => (
              <div
                key={index}
                className='border-b border-[#f2ede2] px-3 py-2 text-xs last:border-0'
              >
                {participant === username ? (
                  <span className='font-semibold text-[#1a1916]'>you</span>
                ) : (
                  <span className='text-[#7a7770]'>{participant}</span>
                )}
              </div>
            ))
          ) : (
            <div className='px-3 py-2.5 text-xs text-[#b8b4ab]'>
              No participants
            </div>
          )}
        </div>
      )}
    </div>
  );
}
