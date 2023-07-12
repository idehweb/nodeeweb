import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  inline: {
    display: 'inline-block',
    width: '50%',
  },
  f2: {
    display: 'inline-block',
    width: '48%',
    marginLeft: '2%',
  },
  f3: {
    display: 'inline-block',
    width: '33%',
  },
  form: {
    '& > div:first-child': {
      padding: '1.5rem 4rem',
    },
  },
  noPadding: {
    '& > div:first-child': {
      padding: 0,
    },
  },
  headerRow: {
    borderLeftColor: 'white',
    borderLeftWidth: 5,
    borderLeftStyle: 'solid',
  },
  headerCell: {
    padding: '6px 8px 6px 8px',
  },
  rowCell: {
    padding: '6px 8px 6px 8px',
  },
  comment: {
    maxWidth: '18em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  btnLink: {
    textDecoration: 'none',
    marginTop: 20,
  },
}));
