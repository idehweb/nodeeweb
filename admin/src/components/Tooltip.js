import React from 'react';
import { Tooltip, Zoom } from '@mui/material';

export default function CustomTooltip({ children, title }) {
  return (
    <Tooltip
      title={title}
      TransitionComponent={Zoom}
      leaveDelay={300}
      placement="top"
      arrow>
      {children}
    </Tooltip>
  );
}
