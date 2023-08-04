import React from 'react';
import { makeStyles } from '@mui/styles';
import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

const useStyles = makeStyles({
  loading: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
});

export default function Loading({ loadingClass, size = 50 }) {
  const cls = useStyles();
  return (
    <div className={clsx(cls.loading, loadingClass)}>
      <CircularProgress size={size} />
    </div>
  );
}
