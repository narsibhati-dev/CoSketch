'use client';

import React, { useState } from 'react';
import RoomCard from './room-card';
import { useRooms } from '@/hooks/useRooms';
import Spinner from '@/components/spinner';
import { fraunces } from '@/data/fonts';
import { RotateCw, Plus, Users } from 'lucide-react';
import CreateRoomDialogBox from '@/components/dialogbox/create-room-dialogbox';
import JoinRoomDialogBox from '@/components/dialogbox/join-room-dialogBox';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const Rooms = () => {
  const { userName, rooms, isLoading, isRefetching, isError, refetch } = useRooms();
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);

  const displayName =
    userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner size={36} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex min-h-screen items-center justify-center px-6'>
        <div className='rounded-2xl border border-[#e8e2d4] bg-white px-8 py-12 text-center'>
          <p className='text-sm text-[#7a7770]'>
            Couldn&apos;t load your rooms.{' '}
            <button
              onClick={() => refetch()}
              className='font-semibold text-[#1a1916] hover:text-[#e04e1f]'
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Welcome Banner ── */}
      <div className='relative overflow-hidden bg-[#1a1916]'>
        {/* dot grid */}
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.06]'
          style={{
            backgroundImage: 'radial-gradient(circle, #f9f6ef 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* decorative marks */}
        <svg className='absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.12]' width='180' height='120' viewBox='0 0 180 120' fill='none'>
          <path d='M10 60 C 40 20, 70 100, 100 60 S 150 20, 170 60' stroke='#e04e1f' strokeWidth='2' strokeLinecap='round' fill='none' />
          <circle cx='150' cy='30' r='18' stroke='#e04e1f' strokeWidth='1.5' strokeDasharray='5 4' fill='none' />
        </svg>

        <div className='relative z-10 mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between'>
          {/* Left: greeting */}
          <div>
            <p className='mb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a7770]'>
              {getGreeting()}
            </p>
            <h1 className={`${fraunces.className} text-3xl font-semibold text-[#f9f6ef] sm:text-4xl`}>
              Hello,{' '}
              <em className='not-italic text-[#e04e1f]'>{displayName || 'there'}.</em>
            </h1>
            <p className='mt-1 text-sm text-[#5a5750]'>
              {rooms.length === 0
                ? 'No rooms yet — create one to start.'
                : `${rooms.length} room${rooms.length !== 1 ? 's' : ''} ready to collaborate.`}
            </p>
          </div>

          {/* Right: actions */}
          <div className='flex shrink-0 items-center gap-2.5'>
            <button
              onClick={() => setJoinRoom(true)}
              className='flex items-center gap-1.5 rounded-xl border border-[#f9f6ef]/15 px-4 py-2 text-sm font-medium text-[#a8a49b] transition-colors hover:border-[#f9f6ef]/30 hover:text-[#f9f6ef]'
            >
              <Users className='h-3.5 w-3.5' />
              Join Room
            </button>
            <button
              onClick={() => setCreateRoom(true)}
              className='flex items-center gap-1.5 rounded-xl bg-[#e04e1f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c94318]'
            >
              <Plus className='h-3.5 w-3.5' />
              New Room
            </button>
          </div>
        </div>
      </div>

      {/* ── Rooms Section ── */}
      <div className='mx-auto max-w-7xl px-6 py-8'>
        {/* Section header */}
        <div className='mb-5 flex items-center justify-between'>
          <h2 className={`${fraunces.className} text-lg font-semibold text-[#1a1916]`}>
            {rooms.length > 0
              ? `${rooms.length} Room${rooms.length !== 1 ? 's' : ''}`
              : 'Your Rooms'}
          </h2>
          <button
            onClick={async () => await refetch()}
            disabled={isRefetching}
            className='flex items-center gap-1.5 rounded-lg border border-[#e8e2d4] px-3 py-1.5 text-xs font-medium text-[#7a7770] transition-colors hover:border-[#1a1916]/20 hover:text-[#1a1916] disabled:opacity-50'
          >
            <RotateCw size={11} className={isRefetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {rooms.length > 0 ? (
          <div className='relative'>
            {isRefetching && (
              <div className='absolute inset-0 z-10 rounded-2xl bg-[#f9f6ef]/60 backdrop-blur-[1px]' />
            )}
            <div
              className={`grid grid-cols-1 gap-4 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${isRefetching ? 'opacity-50' : 'opacity-100'}`}
            >
              {rooms.map((room, index) => (
                <RoomCard
                  key={room.roomId}
                  room={room}
                  username={userName}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ── Empty State ── */
          <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e8e2d4] bg-white px-8 py-20 text-center'>
            <div className='relative mb-5'>
              <svg width='64' height='64' viewBox='0 0 64 64' fill='none' className='mx-auto'>
                <rect x='6' y='6' width='52' height='52' rx='10' fill='#f9f6ef' stroke='#e8e2d4' strokeWidth='1.5' />
                <path d='M20 36 C 24 28, 28 40, 32 34 S 38 26, 44 34' stroke='#e04e1f' strokeWidth='2' strokeLinecap='round' fill='none' />
                <circle cx='20' cy='42' r='2' fill='#e8e2d4' />
                <circle cx='44' cy='24' r='2' fill='#e8e2d4' />
              </svg>
              <span className='absolute -right-1 -top-1 text-base font-bold text-[#e04e1f] opacity-50'>✦</span>
            </div>
            <h3 className={`${fraunces.className} text-xl font-semibold text-[#1a1916]`}>
              Your canvas awaits.
            </h3>
            <p className='mt-1.5 max-w-xs text-sm text-[#7a7770]'>
              Create your first room and invite others to sketch, brainstorm, and build together.
            </p>
            <button
              onClick={() => setCreateRoom(true)}
              className='mt-6 flex items-center gap-2 rounded-xl bg-[#1a1916] px-5 py-2.5 text-sm font-semibold text-[#f9f6ef] transition-colors hover:bg-[#2d2c26]'
            >
              <Plus className='h-4 w-4' />
              Create First Room
            </button>
          </div>
        )}
      </div>

      {createRoom && <CreateRoomDialogBox onClose={setCreateRoom} />}
      {joinRoom && <JoinRoomDialogBox onClose={setJoinRoom} />}
    </>
  );
};

export default Rooms;
