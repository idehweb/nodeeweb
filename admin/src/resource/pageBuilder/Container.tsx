import { styled } from '@mui/material';

export default styled('main')(() => ({
  minHeight: 'calc(100vh - 60px)',
  background: '#fff',
  padding: '8px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  '& .cp-row .content': {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 4,
    '& > ': {
      '&:not(.cont-col)': {
        width: '100%',
      },
      '& .cont-col': {
        flex: 1,
        display: 'flex',
      },
      '& .cont-slot': {
        width: 16,
        '& > div': {
          height: '100%',
        },
      },
    },
  },
}));
