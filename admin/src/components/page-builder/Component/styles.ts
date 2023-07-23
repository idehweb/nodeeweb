import { makeStyles } from '@mui/styles';

export default makeStyles<any>(({ palette, spacing }) => ({
  modal: {
    maxHeight: '100vh',
    margin: '16px auto !important',
  },
  container: {
    maxWidth: 800,
    overflowY: 'auto',
    color: '#5a6169',
  },
}));
