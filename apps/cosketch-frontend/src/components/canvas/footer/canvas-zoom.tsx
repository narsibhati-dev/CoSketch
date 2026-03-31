'use client';

import { useViewportStore } from '@/stores/viewport.store';
import { useCanvasEngineStore } from '@/stores/canvas.store';
import { Minus, Plus } from 'lucide-react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

const CanvasZoom = () => {
  const zoom = useViewportStore(s => s.zoom);
  const { canvasEngine } = useCanvasEngineStore();

  const zoomIn = () => canvasEngine?.zoomBy(1.1);
  const zoomOut = () => canvasEngine?.zoomBy(1 / 1.1);

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className='bg-background flex items-center gap-4 rounded-lg shadow-md'>
      <button
        onClick={zoomOut}
        disabled={zoom <= MIN_ZOOM}
        className={`cursor-pointer rounded-l-lg p-2 ${
          zoom <= MIN_ZOOM
            ? 'cursor-not-allowed text-gray-400'
            : 'hover:bg-light_background text-white'
        }`}
      >
        <Minus className='h-5 w-5' />
      </button>

      <span className='text-lg font-semibold text-white'>{zoomPercent}%</span>

      <button
        onClick={zoomIn}
        disabled={zoom >= MAX_ZOOM}
        className={`cursor-pointer rounded-r-lg p-2 ${
          zoom >= MAX_ZOOM
            ? 'cursor-not-allowed text-gray-400'
            : 'hover:bg-light_background text-white'
        }`}
      >
        <Plus className='h-5 w-5' />
      </button>
    </div>
  );
};

export default CanvasZoom;
