'use client';

import ProtectCanvasRoute from '@/components/guards/protectCanvasRoute';
import Canvas from '@/components/canvas/canvas';

import { useParams } from 'next/navigation';

const CanvasPage = () => {
  const { roomId } = useParams() as { roomId: string };

  return (
    <ProtectCanvasRoute roomId={roomId}>
      <section className='h-screen overflow-hidden'>
        <Canvas roomId={roomId} />
      </section>
    </ProtectCanvasRoute>
  );
};

export default CanvasPage;
