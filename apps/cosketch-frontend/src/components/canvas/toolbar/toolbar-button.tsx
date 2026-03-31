import React from 'react';
import Tooltip from './tooltip';

interface ToolbarButtonProps {
  id: number;
  tooltip: string;
  isSelected?: boolean;
  onClick?: () => void;
  icon: React.ElementType;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  isSelected,
  onClick,
  id,
  tooltip,
}) => {
  return (
    <div className='group relative flex'>
      <button
        onClick={onClick}
        className={`canvas-btn relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg ${
          isSelected ? 'canvas-btn-selected' : ''
        }`}
      >
        <Icon size={15} />
        <span className='absolute right-1 bottom-0.5 text-[8px] opacity-40 select-none'>
          {id}
        </span>
      </button>

      <Tooltip tooltip={tooltip} />
    </div>
  );
};

export default ToolbarButton;
