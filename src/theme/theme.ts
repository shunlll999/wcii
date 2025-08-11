import { createTheme } from '@mui/material/styles';

const primaryDarkColor = '#ee9c05ff';
const primaryLightColor = '#66b505ff';

export const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: primaryLightColor },
          background: { default: '#f5f5f5', paper: '#fff' },
          text: { primary: '#000' },
        }
      : {
          primary: { main: primaryDarkColor },
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,                // ทำเป็นสี่เหลี่ยม
          backgroundColor: primaryDarkColor,     // สีพื้นหลัง
          color: '#fff',                  // สีไอคอน
          transition: 'background-color 0.3s ease',

          '&:hover': {
            backgroundColor: '#c76809ff',  // สีพื้นหลังตอน hover
          },
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
                  borderColor: primaryLightColor, // สีตอน hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: primaryLightColor, // สีตอน focus
                },
              },
            }
            : {
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: primaryDarkColor, // สีตอน hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: primaryDarkColor, // สีตอน focus
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
