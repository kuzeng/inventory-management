'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#013e87",
    },
    secondary: {
      main: "#2e74c9",
    },
    typography: {
      h1: {
        fontSize: "3rem",
        fontweight: 600,
      },
      h2: {
        fontSize: "1.75rem",
        fontweight: 600,
      },
      h3: {
        fontSize: "1.5rem",
        fontweight: 600,
      },
    },
  },
  components: {
    MuiBox: {
      styleOverrides: {
        root: {
          "& +.MuiBox-root": {
            marginTop: 0
          }
        }
      }
    }
  }
})

export default theme;