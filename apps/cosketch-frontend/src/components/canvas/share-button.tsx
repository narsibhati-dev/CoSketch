'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, Loader2, ChevronDown } from 'lucide-react';
// import { toast } from 'react-hot-toast';

interface ShareButtonProps {
  roomId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ roomId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [dashboardUrl, setDashboardUrl] = useState('');

  // Set dashboard URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDashboardUrl(`${window.location.origin}/dashboard`);
    }
  }, []);

  const shareMessage = `🎨 JOIN MY COSKETCH ROOM! ✨
🚀 Let's collaborate in real-time on CoSketch and bring ideas to life!

🔹 ROOM ID: ${roomId}
🔹 JOIN FROM DASHBOARD: ${dashboardUrl}

🖌️ Head to the dashboard, enter the Room ID, and start sketching with us! 🎭`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleShare = async () => {
    setIsProcessing(true);
    try {
      await navigator.share({
        title: 'Join My CoSketch Room!',
        text: shareMessage,
        url: dashboardUrl,
      });
      // toast.success('Room link shared successfully!');
    } catch {
      // toast.error('Failed to share the link.');
    } finally {
      setIsProcessing(false);
      setIsOpen(false);
    }
  };

  const handleCopy = async () => {
    setIsProcessing(true);
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      // toast.success('Room link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // toast.error('Failed to copy the link.');
    } finally {
      setIsProcessing(false);
      setIsOpen(false);
    }
  };

  return (
    <div className='relative block' ref={menuRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        disabled={isProcessing}
        className='canvas-panel canvas-btn flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-40'
      >
        {isProcessing ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : copied ? (
          <Check className='h-4 w-4 text-green-400' />
        ) : (
          <Share2 className='h-4 w-4' />
        )}
        {isProcessing ? 'Processing...' : copied ? 'Copied!' : 'Share'}
        <ChevronDown className='h-3.5 w-3.5 opacity-60' />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='canvas-panel absolute right-0 mt-2 w-44 rounded-xl p-1.5'>
          <button
            onClick={handleShare}
            disabled={isProcessing}
            className='canvas-btn flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm disabled:opacity-40'
          >
            {isProcessing ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Share2 className='h-4 w-4' />
            )}
            {isProcessing ? 'Sharing...' : 'Share'}
          </button>
          <button
            onClick={handleCopy}
            disabled={isProcessing}
            className='canvas-btn flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm disabled:opacity-40'
          >
            {isProcessing ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : copied ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : (
              <Copy className='h-4 w-4' />
            )}
            {isProcessing ? 'Copying...' : copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
