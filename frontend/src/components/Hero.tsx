import { Box, Typography, Button, Container } from '@mui/material';

const Hero = () => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
      }}
    >
      <Container>
        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          gutterBottom
        >
          La Oficina del Futuro para su Empresa, Hoy
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="primary.contrastText"
          paragraph
          sx={{ mb: 4 }}
        >
          Escritorios virtuales seguros, potentes y accesibles, gestionados íntegramente por nosotros. 
          Concéntrese en su negocio, nosotros nos encargamos del resto.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          color="secondary"
          href="#contact"
        >
          Solicitar una Demo
        </Button>
      </Container>
    </Box>
  );
};

export default Hero;
