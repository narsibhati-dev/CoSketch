'use client';

import React, { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import {
  MousePointer,
  Square,
  MoveRight,
  Pencil,
  Eraser,
  Trash,
  LockKeyholeOpen,
  LockKeyhole,
} from 'lucide-react';
import { Tool } from '@/type/tool';
import { useToolStore } from '@/stores/tool.store';
import ConfirmationDialog from '@/components/dialogbox/confirmation-dialog';
import { CanvasMessage } from '@/hooks/useSocket';
import { useCanvasEngineStore } from '@/stores/canvas.store';

const tools: { icon: LucideIcon; tool: Tool }[] = [
  { icon: MousePointer, tool: 'Selection' },
  { icon: Square,       tool: 'Rectangle' },
  { icon: MoveRight,    tool: 'Arrow'     },
  { icon: Pencil,       tool: 'Freehand'  },
  { icon: Eraser,       tool: 'Eraser'    },
];

interface MobileToolbarProps {
  roomId: string;
  sendMessage: (message: CanvasMessage) => void;
}

const MobileToolbar: React.FC<MobileToolbarProps> = ({ roomId, sendMessage }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedTool, setSelectedTool } = useToolStore();
  const { canvasEngine } = useCanvasEngineStore();

  const confirmClear = () => {
    sendMessage({ type: 'canvas:clear', room: roomId });
    canvasEngine?.cleanCanvas();
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const resetTool = () => {
      if (
        !isLocked &&
        selectedTool !== 'Freehand' &&
        selectedTool !== 'Eraser' &&
        selectedTool !== 'Selection'
      ) {
        setSelectedTool('Selection');
      }
    };
    window.addEventListener('pointerup', resetTool);
    return () => window.removeEventListener('pointerup', resetTool);
  }, [isLocked, selectedTool, setSelectedTool]);

  return (
    <>
      {/* Safe-area wrapper — sits flush at the bottom of the screen */}
      <div
        className='fixed bottom-0 left-0 right-0 z-20 md:hidden'
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <nav className='mobile-toolbar-panel flex items-stretch'>
          {/* ── Lock ────────────────────────────────── */}
          <button
            onClick={() => setIsLocked(p => !p)}
            aria-label='Toggle lock'
            className={`mobile-tool-btn w-12 shrink-0 ${isLocked ? 'mobile-tool-btn--lock-on' : ''}`}
          >
            {isLocked ? <LockKeyhole size={20} /> : <LockKeyholeOpen size={20} />}
          </button>

          <div className='mobile-toolbar-divider' />

          {/* ── Drawing tools ───────────────────────── */}
          {tools.map(({ icon: Icon, tool }) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              aria-label={tool}
              className={`mobile-tool-btn flex-1 ${selectedTool === tool ? 'mobile-tool-btn--active' : ''}`}
            >
              <Icon size={22} strokeWidth={selectedTool === tool ? 2.2 : 1.8} />
            </button>
          ))}

          <div className='mobile-toolbar-divider' />

          {/* ── Clear ───────────────────────────────── */}
          <button
            onClick={() => setIsDialogOpen(true)}
            aria-label='Clear canvas'
            className='mobile-tool-btn mobile-tool-btn--clear w-12 shrink-0'
          >
            <Trash size={19} />
          </button>
        </nav>
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title='Clear Canvas'
        message='Are you sure you want to clear the canvas? This action cannot be undone.'
        confirmText='Clear'
        cancelText='Cancel'
        onConfirm={confirmClear}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default MobileToolbar;
