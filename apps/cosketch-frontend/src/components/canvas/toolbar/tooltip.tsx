import React from 'react';

const Tooltip = ({ tooltip }: { tooltip: string }) => {
  return <div className='canvas-tooltip'>{tooltip}</div>;
};

export default Tooltip;
