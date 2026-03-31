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
    <div className='canvas-panel flex items-center gap-1 rounded-xl px-1 py-1'>
      <button
        onClick={zoomOut}
        disabled={zoom <= MIN_ZOOM}
        className={`canvas-btn flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${
          zoom <= MIN_ZOOM ? 'cursor-not-allowed opacity-30' : ''
        }`}
      >
        <Minus className='h-3.5 w-3.5' />
      </button>

      <span className='min-w-[44px] text-center text-xs font-semibold tracking-wide text-[rgba(210,200,185,0.75)]'>
        {zoomPercent}%
      </span>

      <button
        onClick={zoomIn}
        disabled={zoom >= MAX_ZOOM}
        className={`canvas-btn flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg ${
          zoom >= MAX_ZOOM ? 'cursor-not-allowed opacity-30' : ''
        }`}
      >
        <Plus className='h-3.5 w-3.5' />
      </button>
    </div>
  );
};

export default CanvasZoom;
