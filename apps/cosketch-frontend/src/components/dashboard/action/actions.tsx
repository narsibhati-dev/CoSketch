'use client';

import { Plus, Users } from 'lucide-react';
import React, { useState } from 'react';
import CreateRoomDialogBox from '@/components/dialogbox/create-room-dialogbox';
import JoinRoomDialogBox from '@/components/dialogbox/join-room-dialogBox';
import ActionCard from './action-card';

const Actions = () => {
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);

  return (
    <section className='mt-24 flex flex-col gap-3 sm:flex-row'>
      <ActionCard
        title='Create New Room'
        description='Start a new collaborative drawing session'
        icon={<Plus className='h-5 w-5 text-[#f9f6ef]' />}
        onClick={() => setCreateRoom(true)}
        primary
      />

      <ActionCard
        title='Join Existing Room'
        description='Enter a room code to join a session'
        icon={<Users className='h-5 w-5 text-[#7a7770]' />}
        onClick={() => setJoinRoom(true)}
      />

      {createRoom && <CreateRoomDialogBox onClose={setCreateRoom} />}
      {joinRoom && <JoinRoomDialogBox onClose={setJoinRoom} />}
    </section>
  );
};

export default Actions;
