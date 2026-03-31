'use client';

import { useState } from 'react';

const EncryptionBadge = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className='relative hidden items-center gap-2 text-sm font-medium text-[rgba(175,162,142,0.6)] sm:flex'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='18'
        height='18'
        fill='currentColor'
        className='bi bi-shield-fill-check'
        viewBox='0 0 16 16'
      >
        <path
          fillRule='evenodd'
          d='M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z'
        />
      </svg>

      {/* Tooltip */}
      {isHovered && (
        <div className='canvas-panel absolute -top-20 left-1/2 w-max -translate-x-[80%] rounded-xl px-5 py-4 text-sm whitespace-nowrap text-[rgba(215,205,188,0.9)]'>
          Your drawings are <strong>fully private & secured</strong>.
        </div>
      )}
    </div>
  );
};

export default EncryptionBadge;
