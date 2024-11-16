import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
      primary: {
        main: '#6C63FF',
        light: '#8F89FF',
        dark: '#5650CC',
      },
      secondary: {
        main: '#FF6584',
        light: '#FF89A0',
        dark: '#CC516A',
      },
      background: {
        default: '#F0F2F5',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#333333',
        secondary: '#65748B',
      },
    },

    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: 'rgba(108, 99, 255, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(108, 99, 255, 0.12)',
              },
            },
          },
        },
      },
    },
  });
  
  export default theme;