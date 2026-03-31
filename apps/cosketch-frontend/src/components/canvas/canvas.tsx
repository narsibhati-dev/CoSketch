'use client';

import React, { useEffect, useRef } from 'react';
import CanvasFooter from './footer/canvas-footer';
import CanvasHeader from './header/canvas-header';
import { CanvasEngine } from '@/canvas_engine/CanvasEngine';
import Sidebar from './sidebar/sidebar';
import MobileToolbar from './toolbar/mobile-toolbar';
import { useCanvasEngineStore } from '@/stores/canvas.store';
import { useIsShapeSelectedStore } from '@/stores/shape_selected.store';
import { useCanvasStyleStore } from '@/stores/canvas_style.store';
import { useToolStore } from '@/stores/tool.store';
import { IncomingMessage } from '@repo/types';
import toast from 'react-hot-toast';
import { UserPlus, UserMinus } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

interface CanvasProps {
  roomId: string;
}

const cursorStyles = {
  Eraser: 'none',
  Freehand: 'crosshair',
  Text: 'text',
  Selection: 'pointer',
  Rectangle: 'crosshair',
  Diamond: 'crosshair',
  Ellipse: 'crosshair',
  Arrow: 'default',
  Line: 'crosshair',
  default: 'crosshair',
};

const Canvas: React.FC<CanvasProps> = ({ roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { canvasEngine, setCanvasEngine } = useCanvasEngineStore();
  const token = localStorage.getItem('token')?.split(' ')[1];

  // Canvas style properties - moved before conditional checks
  const {
    strokeColor,
    backgroundColor,
    strokeWidth,
    strokeStyle,
    roughness,
    fillStyle,
  } = useCanvasStyleStore();

  const selectedTool = useToolStore(s => s.selectedTool);

  const handleOnMessage = (message: IncomingMessage) => {
    if (!canvasEngine) return;

    switch (message.type) {
      case 'canvas:draw':
        canvasEngine.onDrawMessage(message.data);
        break;

      case 'canvas:update':
        canvasEngine.OnUpdateMessage(message.data);
        break;

      case 'canvas:erase':
        canvasEngine.onEraseMessage(message.shapeId);
        break;

      case 'canvas:clear':
        canvasEngine.OnClearMessage();
        break;

      case 'user:connected':
        toast.success(
          message.userId
            ? `${message.userId} has joined the canvas!`
            : 'A user has joined the canvas!',
          {
            icon: <UserPlus className='text-green-500' />,
          },
        );
        break;

      case 'user:disconnected':
        toast(
          message.userId
            ? `${message.userId} has left the session.`
            : 'A user has left the session.',
          {
            icon: <UserMinus className='text-red-500' />,
          },
        );
        break;

      case 'error':
        console.error('WebSocket error:', message.message);
        break;

      default:
        console.warn('Unknown message type:', message);
    }
  };

  const { sendMessage } = useSocket({
    roomId,
    token: token || '',
    onMessage: handleOnMessage,
    onOpen: () => console.log('Connected'),
    onClose: () => console.log('Disconnected'),
  });

  // Initialize canvas and controllers
  useEffect(() => {
    if (!token) {
      toast.error('Redirecting to login...');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = new CanvasEngine(canvas, roomId, sendMessage);
    setCanvasEngine(draw);

    // Mouse event handlers with optimized state updates
    const handleMouseEvent = () => {
      const currentSelection = draw.getSelectedShape();
      const isSelected = !!currentSelection;
      const currentState = useIsShapeSelectedStore.getState().isShapeSelected;
      if (isSelected !== currentState) {
        useIsShapeSelectedStore.setState({ isShapeSelected: isSelected });
      }
    };

    canvas.addEventListener('mousedown', handleMouseEvent);
    canvas.addEventListener('mouseup', handleMouseEvent);

    return () => {
      draw.destroy();
      canvas.removeEventListener('mousedown', handleMouseEvent);
      canvas.removeEventListener('mouseup', handleMouseEvent);
    };
  }, [roomId, sendMessage, setCanvasEngine, token]);

  // Update selected tool
  useEffect(() => {
    if (!canvasEngine) return;

    const currentTool = canvasEngine.getSelectedTool();
    if (currentTool !== selectedTool) {
      canvasEngine.setSelectedTool(selectedTool);
    }
  }, [canvasEngine, selectedTool]);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      // Use the canvas's rendered CSS size so the drawing buffer always
      // matches the actual displayed area (robust on mobile viewports).
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
      if (!canvasEngine) return;
      canvasEngine.clearCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cursor style
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = cursorStyles[selectedTool] || cursorStyles.default;
    }
  }, [selectedTool]);

  // Style properties update
  useEffect(() => {
    if (!canvasEngine) return;

    canvasEngine.setStrokeColor(strokeColor);
    canvasEngine.setFillColor(backgroundColor);
    canvasEngine.setStrokeWidth(strokeWidth);
    canvasEngine.setStrokeStyle(strokeStyle);
    canvasEngine.setRoughness(roughness);
    canvasEngine.setFillStyle(fillStyle);
  }, [
    canvasEngine,
    strokeColor,
    backgroundColor,
    strokeWidth,
    strokeStyle,
    roughness,
    fillStyle,
  ]);

  if (!token) {
    return null;
  }

  return (
    <>
      <CanvasHeader roomId={roomId} sendMessage={sendMessage} />

      <Sidebar selectedTool={selectedTool} />
      <canvas ref={canvasRef} className='canvas-surface fixed inset-0 z-0 h-screen w-screen touch-none' />
      {/* Mobile bottom toolbar — only visible on < md */}
      <MobileToolbar roomId={roomId} sendMessage={sendMessage} />
      <CanvasFooter />
    </>
  );
};

export default React.memo(Canvas);
