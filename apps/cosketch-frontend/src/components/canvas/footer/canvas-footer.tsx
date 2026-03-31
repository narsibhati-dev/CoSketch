import React from 'react';
import CanvasZoom from './canvas-zoom';
import EncryptionBadge from './Encryption';

const CanvasFooter = () => {
  return (
    <footer className='fixed bottom-0 left-0 z-10 hidden w-full items-center justify-between px-5 py-4 md:flex lg:px-6'>
      <CanvasZoom />
      <EncryptionBadge />
    </footer>
  );
};

export default CanvasFooter;
