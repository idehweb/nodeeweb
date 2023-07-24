import { forwardRef } from 'react';
import { makeStyles } from '@mui/styles';
import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

const useStyles = makeStyles({
  loading: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0006',
    zIndex: 10000,
  },
});

type Props<T> = React.HTMLAttributes<T> & {
  loading: boolean;
  loadingClass?: string;
  size?: number;
  as?: React.ElementType;
};

const LoadingContainer = forwardRef(
  (
    {
      loading = false,
      loadingClass,
      size = 50,
      children,
      className,
      as = 'div',
      ...rest
    }: Props<HTMLDivElement>,
    ref
  ) => {
    const cls = useStyles();
    let Component = as;

    return (
      <Component ref={ref} className={className} {...rest}>
        {loading ? (
          <div className={clsx(cls.loading, loadingClass)}>
            <CircularProgress color="secondary" size={size} />
          </div>
        ) : null}
        {children}
      </Component>
    );
  }
);
LoadingContainer.displayName = 'LoadingContainer';
export default LoadingContainer;
