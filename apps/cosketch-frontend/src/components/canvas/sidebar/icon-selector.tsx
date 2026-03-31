import clsx from 'clsx';
import React, { useMemo } from 'react';

interface IconOption<T extends string> {
  Icon: React.ComponentType<{ className?: string }>;
  key: T;
}

interface IconSelectorProps<T extends string> {
  icons: IconOption<T>[];
  selectedIcon: T;
  setSelectedIcon: (iconId: T) => void;
  title: string;
}

const IconSelector = <T extends string>({
  icons,
  selectedIcon,
  setSelectedIcon,
  title,
}: IconSelectorProps<T>) => {
  const iconButtons = useMemo(
    () =>
      icons.map(({ Icon, key }) => (
        <button
          key={key}
          className={clsx(
            'canvas-btn flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg',
            selectedIcon === key ? 'canvas-btn-selected' : '',
          )}
          onClick={() => {
            if (selectedIcon !== key) setSelectedIcon(key);
          }}
          aria-label={`${title} - ${key}`}
        >
          <Icon className='h-5 w-5' />
        </button>
      )),
    [icons, selectedIcon, setSelectedIcon, title],
  );

  return (
    <div className='mb-1'>
      <p className='canvas-label'>{title}</p>
      <div className='flex gap-1.5'>{iconButtons}</div>
    </div>
  );
};

export default IconSelector;
