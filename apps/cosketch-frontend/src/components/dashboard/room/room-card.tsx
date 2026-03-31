'use client';

import React, { useState } from 'react';
import { Calendar, Trash2, Clipboard, ClipboardCheck, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import RoomParticipants from './room-participants';
import { RoomData } from '@/hooks/useRooms';
import DeleteRoomDialogBox from '@/components/dialogbox/delete-room-dialogbox';
import useJoinRoomMutation from '@/hooks/useJoinRoom';
import { fraunces } from '@/data/fonts';

export interface RoomCardProps {
  username?: string;
  room: RoomData;
  index: number;
}

const THUMBNAIL_PALETTES = [
  { bg: '#1a1916', accent: '#e04e1f', lines: '#3d3c36' },
  { bg: '#2d1a0e', accent: '#e8845c', lines: '#3d2616' },
  { bg: '#0e1a2d', accent: '#5c88e8', lines: '#162236' },
  { bg: '#0e2d1a', accent: '#5ce8a0', lines: '#163d26' },
  { bg: '#2d0e2d', accent: '#d45ce8', lines: '#3d163d' },
];

const RoomCard: React.FC<RoomCardProps> = ({ username, room, index }) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hovered, setHovered] = useState(false);

  const palette = THUMBNAIL_PALETTES[index % THUMBNAIL_PALETTES.length];
  const initial = (room.slug?.[0] ?? 'R').toUpperCase();

  const formattedDate = new Date(room.createdAt).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(room.roomId);
      setCopied(true);
      toast.success('Room ID copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const { mutate: joinRoom } = useJoinRoomMutation();

  const handleJoinRoom = () => {
    if (!room.roomId) {
      toast.error('Invalid Room ID.');
      return;
    }
    joinRoom(room.roomId);
  };

  return (
    <>
      <div className='group flex flex-col rounded-2xl border border-[#e8e2d4] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1a1916]/15 hover:shadow-lg hover:shadow-[#1a1916]/8'>

        {/* ── Thumbnail ── */}
        <div
          className='relative h-36 cursor-pointer overflow-hidden rounded-t-2xl'
          style={{ backgroundColor: palette.bg }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleJoinRoom}
        >
          {/* Abstract sketch SVG */}
          <svg
            className='absolute inset-0 h-full w-full'
            viewBox='0 0 280 144'
            fill='none'
            preserveAspectRatio='xMidYMid slice'
          >
            {/* grid lines */}
            <line x1='0' y1='48' x2='280' y2='48' stroke={palette.lines} strokeWidth='1' />
            <line x1='0' y1='96' x2='280' y2='96' stroke={palette.lines} strokeWidth='1' />
            <line x1='70' y1='0' x2='70' y2='144' stroke={palette.lines} strokeWidth='1' />
            <line x1='140' y1='0' x2='140' y2='144' stroke={palette.lines} strokeWidth='1' />
            <line x1='210' y1='0' x2='210' y2='144' stroke={palette.lines} strokeWidth='1' />
            {/* sketch strokes */}
            <path
              d='M30 90 C 50 60, 70 110, 90 80 S 120 50, 140 70 S 170 95, 200 65 S 230 40, 260 60'
              stroke={palette.accent}
              strokeWidth='2'
              strokeLinecap='round'
              fill='none'
              opacity='0.7'
            />
            <circle cx='90' cy='80' r='12' stroke={palette.accent} strokeWidth='1.5' fill='none' opacity='0.4' />
            <rect x='170' y='40' width='40' height='28' rx='4' stroke={palette.accent} strokeWidth='1.5' fill='none' opacity='0.3' />
            <path d='M50 30 L 65 50 L 35 50 Z' stroke={palette.accent} strokeWidth='1.5' fill='none' opacity='0.25' />
          </svg>

          {/* large room initial */}
          <span
            className={`${fraunces.className} absolute inset-0 flex select-none items-center justify-center text-6xl font-semibold italic sm:text-7xl`}
            style={{ color: palette.accent, opacity: 0.15 }}
          >
            {initial}
          </span>

          {/* hover overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-[#1a1916]/60 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <button
              onClick={handleJoinRoom}
              className='flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1a1916] shadow-lg transition-transform duration-150 hover:scale-105 sm:px-5'
            >
              <LogIn className='h-4 w-4' />
              Open Canvas
            </button>
          </div>
        </div>

        {/* ── Card Body ── */}
        <div className='flex flex-1 flex-col gap-3 px-4 py-3.5'>
          {/* Room name */}
          <h3 className='truncate text-sm font-semibold text-[#1a1916]'>
            {room.slug}
          </h3>

          {/* ID copy */}
          <button
            onClick={handleCopy}
            className='flex w-fit items-center gap-1.5 text-xs text-[#b8b4ab] transition-colors hover:text-[#7a7770]'
          >
            <span className='font-mono'>{room.roomId.slice(0, 14)}&hellip;</span>
            {copied ? (
              <ClipboardCheck className='h-3.5 w-3.5 text-[#e04e1f]' />
            ) : (
              <Clipboard className='h-3.5 w-3.5' />
            )}
          </button>

          {/* Footer: date + participants + delete */}
          <div className='mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#f2ede2] pt-2.5 text-xs text-[#b8b4ab]'>
            <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
              <span className='flex items-center gap-1'>
                <Calendar className='h-3 w-3' />
                {formattedDate}
              </span>
              <RoomParticipants
                participants={room.participants}
                noOfParticipants={room.noOfParticipants}
                username={username}
              />
            </div>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className='rounded-md p-1 transition-colors hover:bg-red-50 hover:text-red-400'
            >
              <Trash2 className='h-3.5 w-3.5' />
            </button>
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteRoomDialogBox
          roomId={room.roomId}
          onClose={setShowDeleteDialog}
        />
      )}
    </>
  );
};

export default RoomCard;
