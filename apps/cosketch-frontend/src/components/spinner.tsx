import React from 'react';

interface SpinnerProps {
  size?: number;
  light?: boolean;
}

const Spinner = ({ size = 44, light = false }: SpinnerProps) => {
  const trackColor = light ? 'rgba(249,246,239,0.15)' : '#e8e2d4';
  const arcColor = light ? '#f9f6ef' : '#e04e1f';

  return (
    <div
      className='animate-spin'
      style={{ width: size, height: size }}
    >
      <svg viewBox='0 0 44 44' fill='none' width={size} height={size}>
        <circle
          cx='22'
          cy='22'
          r='17'
          stroke={trackColor}
          strokeWidth='2.5'
          fill='none'
        />
        <path
          d='M 22 5 A 17 17 0 0 1 39 22'
          stroke={arcColor}
          strokeWidth='2.5'
          strokeLinecap='round'
          fill='none'
        />
      </svg>
    </div>
  );
};

export default Spinner;
