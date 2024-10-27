import { VerticalAlignCenter } from '@mui/icons-material';
import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customColor: Palette['primary'];
  }
  interface PaletteOptions {
    customColor?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    customColor: true;
  }
}

const customTheme: ThemeOptions = createTheme({
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
  },

  palette: {
    mode: 'light',
    primary: {
      main: '#0071f9',
      light: '#e1effe',
      dark: '#00429d',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00429d',
      light: '#e1effe',
      dark: '#0071f9',
      contrastText: '#fff',
    },
    info: {
      main: '#e1effe',
      contrastText: '#00429d',
      dark: '#e1effe',
    },
    customColor: {
      main: '#f3f4f6',
      light: '#f5f6fa',
      dark: '#c1c2c7',
      contrastText: '#23242d',
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': { borderWidth: '0.5px' },
        },
        sizeSmall: {
          padding: '0.75rem 1.25rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          borderRadius: '0.75rem',
        },
        sizeLarge: {
          fontSize: '1rem',
          fontWeight: 700,
          padding: '1rem 2rem',
          borderRadius: '2rem',
        },
        sizeMedium: {
          padding: '1rem',
          fontSize: '1rem',
          fontWeight: 700,
          borderRadius: '0.5rem',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            opacity: '0.9',
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          transition: 'color 0.3s ease'
        },
        h1: {
          fontSize: '4rem',
          fontWeight: 700,
        },
        h2: {
          fontSize: '3rem',
          fontWeight: 700,
        },
        h3: {
          fontSize: '2.75rem',
          fontWeight: 700,
        },
        h4: {
          fontSize: '1.8rem',
          fontWeight: 600,
        },
        h5: {
          fontSize: '1.875rem',
          fontWeight: 700
        },
        h6: {
          fontSize: '1.2rem',
          fontWeight: 600
        },
        subtitle1: {
          fontSize: '1.5rem',
          fontWeight: 600
        },
        subtitle2: {
          fontSize: '1.25rem',
        },
        body1: {
          fontSize: '1.125rem',
        },
        body2: {
          fontSize: '1rem',
          fontWeight: 600
        },
        caption: {
          fontSize: '0.875rem',
          fontWeight: 500
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          width: '100%',
          '& input': {
            color: '#333',
            '&::placeholder': {
              opacity: 0.7,
            },
          },
          '& fieldset': {
            borderColor: 'rgb(229, 231, 235)',
            borderWidth: '1px',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#007bff !important',
            borderWidth: '1px !important',
            boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
          },
        },
      },
    },

    MuiFilledInput: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          width: '100%',
          backgroundColor: '#fff',
          '&::before': {
            borderBottom: 'none !important',
          },
          '&::after': {
            borderBottom: 'none !important',
          },
          '& input': {
            color: '#333',
            transform: 'translateY(-8px)',
            '&::placeholder': {
              opacity: 0.7,
            },
          },
          '&.Mui-focused': {
            backgroundColor: '#fff',
            borderColor: '#007bff !important',
            borderWidth: '1px !important',
            outline: '4px solid rgb(225, 239, 254)',
            boxShadow: '0 0 10px rgba(0, 123, 255, 0.5)',
            outlineOffset: '1px',
          },
          '&:hover': {
            backgroundColor: '#fff',
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem!important',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem!important',
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          width: '100%',
          '& .MuiSelect-select': {
            padding: '1rem 0.875rem',
            display: 'flex',
            alignItems: 'center',
            color: '#333',
          },
        },
        outlined: {
          '& .MuiSelect-select': {
            padding: '1rem',
            color: '#333',
          },
          '& fieldset': {
            borderColor: 'rgb(229, 231, 235)',
            borderWidth: '1px',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#007bff !important',
            borderWidth: '1px !important',
            boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
          },
          '&:hover fieldset': {
            borderColor: '#007bff !important',
          },
        },
        filled: {
          '& .MuiSelect-select': {
            padding: '1rem',
            backgroundColor: '#fff',
            color: '#333',
          },
          '&:before': {
            borderBottom: 'none',
          },
          '&:after': {
            borderBottom: 'none',
          },
          '&.Mui-focused': {
            backgroundColor: '#fff',
            borderColor: '#007bff !important',
            borderWidth: '1px !important',
            outline: '4px solid rgb(225, 239, 254)',
            boxShadow: '0 0 10px rgba(0, 123, 255, 0.5)',
          },
          '&:hover': {
            backgroundColor: '#fff',
            borderRadius: '0.75rem!important',
          },
        },
      },
    },

    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
          minWidth: '226px',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#23242d',
          fontSize: '1rem',
          fontWeight: 600,
          backgroundColor:'transparent',
          padding: '16px',
          '&:focus': {
            backgroundColor: 'transparent',
          },
          '&:hover': {
            backgroundColor: '#ebf5ff',
          },
          minWidth: '200px',
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#ebf5ff',
          },
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          transform: 'translateY(-8px)',
          color: '#23242d'
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          opacity: 0.9,
          padding: '8px 16px',
          borderRadius: '16px !important',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
          '&:before': {
            display: 'none', 
          },
          '&.Mui-expanded': {
            margin: 'auto', 
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)', 
          },
        },
      },
    },
  },
});

export default customTheme;
