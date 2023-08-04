import React from 'react';
import ReactLoading from 'react-loading';

export default function LoadingComponent({
  type,
  color,
  height,
  width,
  style,
}) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      <ReactLoading type={type} color={color} height={height} width={width} />
    </div>
  );
}
