import { defaultTheme, RaThemeOptions } from 'react-admin';

const MyTheme: RaThemeOptions = {
  // direction: 'rtl',
  ...defaultTheme,
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    // isRtl: true,
  },
  palette: {
    mode: 'dark', // Switching the dark mode on is a single property value change.
  },
  components: {
    ...defaultTheme.components,
    MuiTextField: {
      defaultProps: {
        variant: 'filled' as const,
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'filled' as const,
      },
    },
  },
};

export default MyTheme;
