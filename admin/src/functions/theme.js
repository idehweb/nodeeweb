import { createTheme } from '@mui/material/styles';

export default createTheme({
  // direction: 'rtl',

  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    mode: 'dark', // Switching the dark mode on is a single property value change.
  },
});
