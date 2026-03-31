import React from 'react';
import Rooms from './room/rooms';

export interface RoomResponse {
  roomId: string;
  slug: string;
  createdAt: string;
  participants: string[];
  noOfParticipants: number;
}

const DashboardBody = () => {
  return (
    <div className='min-h-screen bg-[#f9f6ef] pt-14'>
      <Rooms />
    </div>
  );
};

export default DashboardBody;
