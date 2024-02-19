import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  modal: {
    maxHeight: '100vh',
    margin: '16px auto !important',
  },
  container: {
    maxWidth: 800,
    overflowY: 'auto',
    color: '#5a6169',
  },
  textPreview: {
    textAlign: 'center',
    fontSize: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#232F3E',
    width: 'auto',
    padding: '5px',
    boxShadow:
      '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  },
}));
