import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#66b505ff' },
          background: { default: '#f5f5f5', paper: '#fff' },
          text: { primary: '#000' },
        }
      : {
          primary: { main: '#ee9c05ff' },
          background: { default: '#121212', paper: '#1d1d1d' },
          text: { primary: '#fff' },
        }),
  },
  typography: {
    fontFamily: 'Prompt, Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
   components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // ปรับมุมปุ่ม
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          ...(mode === 'light'
            ? {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#66b505ff', // สีตอน hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#66b505ff', // สีตอน focus
                },
              },
            }
            : {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#ee9c05ff', // สีตอน hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ee9c05ff', // สีตอน focus
                },
              },
            }),
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme(getDesignTokens(mode));
