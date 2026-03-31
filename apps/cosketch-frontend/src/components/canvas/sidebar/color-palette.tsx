'use client';

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const transparentColor =
  'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)';

export const strokeColors = [
  { hex: 'transparent' },
  { hex: '#000000' },
  { hex: '#c0c0c0' },
  { hex: '#d9d9d9' },
  { hex: '#a38d84' },
  { hex: '#5e9ea0' },
  { hex: '#72a4d4' },
  { hex: '#c59be7' },
  { hex: '#f191c1' },
  { hex: '#e28e7a' },
  { hex: '#468a55' },
  { hex: '#6dbb7a' },
  { hex: '#b66a2c' },
  { hex: '#f2a444' },
  { hex: '#f4768a' },
  { hex: '#ff1744' },
  { hex: '#ffc107' },
  { hex: '#00e676' },
  { hex: '#651fff' },
  { hex: '#29b6f6' },
];

export const backgroundColors = [
  { hex: 'transparent' },
  { hex: '#ffffff' },
  { hex: '#f8f9fa' },
  { hex: '#f5f5f5' },
  { hex: '#e0f7fa' },
  { hex: '#b2ebf2' },
  { hex: '#b3e5fc' },
  { hex: '#a5d6a7' },
  { hex: '#dcedc8' },
  { hex: '#ffe082' },
  { hex: '#ffecb3' },
  { hex: '#ffe0b2' },
  { hex: '#ffab91' },
  { hex: '#f48fb1' },
  { hex: '#ce93d8' },
  { hex: '#263238' },
  { hex: '#37474f' },
  { hex: '#4a148c' },
  { hex: '#00695c' },
  { hex: '#5d4037' },
];

interface ColorPaletteProps {
  selectedColor: string;
  setColor: (color: string) => void;
  type: 'Stroke' | 'Background'; // Differentiate stroke and background
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  setColor,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const colors = type === 'Stroke' ? strokeColors : backgroundColors;

  const quickColors =
    type === 'Background'
      ? [colors[0], colors[1], colors[4], colors[7]]
      : [colors[1], colors[3], colors[6], colors[8]];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className='relative mb-1' ref={ref}>
      {/* Quick Color Selection */}
      <p className='canvas-label'>{type}</p>
      <div className='flex items-center gap-1.5'>
        {quickColors.map(({ hex }) => (
          <button
            key={hex}
            className={clsx(
              'flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-2 transition-all duration-150',
              selectedColor === hex
                ? 'border-[rgba(196,122,48,0.8)] shadow-[0_0_6px_rgba(196,122,48,0.35)]'
                : 'border-transparent hover:border-white/20',
            )}
            style={{
              backgroundColor: hex === 'transparent' ? 'white' : hex,
              backgroundImage:
                hex === 'transparent' ? transparentColor : 'none',
              backgroundSize: '6px 6px',
              backgroundPosition: '0 0, 3px 3px',
            }}
            onClick={() => {
              if (selectedColor !== hex) {
                setColor(hex);
              }
            }}
            title={hex === 'transparent' ? 'Transparent' : hex}
          ></button>
        ))}

        {/* Open Full Palette Button */}
        <div className='ml-1 border-l border-white/10 pl-2'>
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className={clsx(
              'flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border-2 transition-all duration-150 hover:border-white/20',
              selectedColor === 'transparent'
                ? 'border-white/30'
                : 'border-transparent',
            )}
            style={{
              backgroundColor:
                selectedColor === 'transparent' ? 'white' : selectedColor,
              backgroundImage:
                selectedColor === 'transparent' ? transparentColor : 'none',
              backgroundSize: '6px 6px',
              backgroundPosition: '0 0, 3px 3px',
            }}
            title='More Colors'
          ></button>
        </div>
      </div>

      {/* Color Palette Dropdown */}
      {isOpen && (
        <div className='canvas-panel absolute top-6 left-full z-10 ml-5 w-52 rounded-xl p-4 text-white'>
          <p className='canvas-label mb-3'>
            {type === 'Stroke' ? 'Stroke Color' : 'Background Color'}
          </p>

          {/* Colors */}
          <div className='mb-4 grid grid-cols-5 gap-1.5'>
            {colors.map(({ hex }) => (
              <button
                key={hex}
                className={clsx(
                  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-2 transition-all duration-150',
                  selectedColor === hex
                    ? 'border-[rgba(196,122,48,0.8)] shadow-[0_0_6px_rgba(196,122,48,0.3)]'
                    : 'border-transparent hover:border-white/25',
                )}
                style={{
                  backgroundColor: hex === 'transparent' ? 'white' : hex,
                  backgroundImage:
                    hex === 'transparent' ? transparentColor : 'none',
                  backgroundSize: '6px 6px',
                  backgroundPosition: '0 0, 3px 3px',
                }}
                onClick={() => {
                  if (selectedColor !== hex) {
                    setColor(hex);
                  }
                  // setIsOpen(false); // Close after selection
                }}
                title={hex === 'transparent' ? 'Transparent' : hex}
              ></button>
            ))}
          </div>

          {/* Hex Code Input */}
          <p className='canvas-label mb-2'>Hex Code</p>
          <div className='flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] p-2'>
            <span className='text-[rgba(175,162,142,0.5)] text-sm'>#</span>
            <input
              type='text'
              className='w-full bg-transparent text-white outline-none'
              value={
                selectedColor === 'transparent'
                  ? 'transparent'
                  : selectedColor.replace('#', '')
              }
              readOnly
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ColorPalette;
