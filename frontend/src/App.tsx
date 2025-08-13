import { createTheme, ThemeProvider, CssBaseline, Container } from '@mui/material';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import UseCases from './components/UseCases';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

// Define the new corporate dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00C9FF', // Cian eléctrico como color principal
    },
    secondary: {
      main: '#00FFD1', // Verde-agua futurista para énfasis
    },
    background: {
      default: '#0A0F1C', // Fondo azul marino muy oscuro
      paper: '#121826',   // Gris azulado profundo para "papeles" y cards
    },
    text: {
      primary: '#E0E6F0',   // Blanco suave
      secondary: '#A0AEC0', // Gris claro
    },
    action: {
      hover: 'rgba(0, 201, 255, 0.08)', // Hover cian
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    h2: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    }
  },
});

function App() {
  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const element = document.getElementById(customEvent.detail);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('navigateTo', handleNavigate);

    return () => {
      window.removeEventListener('navigateTo', handleNavigate);
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <main>
        <Hero />
        <Container sx={{ py: 4 }}>
          <Features />
          <UseCases />
          <ContactForm />
        </Container>
      </main>
      <Footer />
      <ChatWidget />
    </ThemeProvider>
  );
}

export default App;