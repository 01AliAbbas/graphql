import { createTheme } from '@mui/material/styles';

const quantumTheme = createTheme({
  palette: {
    mode: 'dark',
    quantum: {
      main: '#1a1a2e',
      dark: '#0f0f1a',
      light: '#252545'
    },
    neon: {
      blue: '#21f3e6',
      purple: '#bc13fe',
      cyan: '#00fffc',
      pink: '#ff00ff'
    },
    background: {
      default: '#0a0a0f',
      paper: '#1a1a2e'
    }
  },
  typography: {
    fontFamily: '"Quantum Sans", "Helvetica Neue", Arial, sans-serif',
    h2: {
      fontSize: '3.5rem',
      textShadow: '0 0 10px currentColor'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)'
        }
      }
    }
  }
});

export default quantumTheme;