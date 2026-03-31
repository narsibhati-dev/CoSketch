import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={onCancel}
    >
      <div
        className='canvas-panel w-[90%] max-w-md rounded-2xl p-7'
        onClick={e => e.stopPropagation()}
      >
        <h2 className='mb-2 text-lg font-semibold tracking-tight text-[rgba(232,222,208,0.95)]'>
          {title}
        </h2>
        <p className='mb-8 text-sm leading-relaxed text-[rgba(160,155,210,0.7)]'>
          {message}
        </p>

        <div className='flex justify-end gap-2'>
          <button
            className='canvas-btn cursor-pointer rounded-lg border border-[rgba(255,255,255,0.08)] px-4 py-2 text-sm font-medium'
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className='cursor-pointer rounded-lg bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 ring-1 ring-red-500/40 transition hover:bg-red-500/30 hover:ring-red-400/60'
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
