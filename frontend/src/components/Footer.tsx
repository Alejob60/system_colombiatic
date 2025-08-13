import { Box, Typography, Link, IconButton, Stack } from '@mui/material';
import { GitHub, LinkedIn, WhatsApp } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        textAlign: 'center', 
        borderTop: '1px solid', 
        borderColor: 'grey.300',
        bgcolor: 'grey.100'
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Typography variant="body1" color="text.primary" fontWeight="bold">
          ColombiaTIC Ingeniería
        </Typography>
        <Typography variant="body2" color="text.secondary">
          NIT: 901407692
        </Typography>
        <Link 
          href="https://wa.me/573026404359" 
          target="_blank" 
          rel="noopener noreferrer"
          variant="body2" 
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', textDecoration: 'none' }}
        >
          <WhatsApp fontSize="small" />
          (+57) 302 640 4359
        </Link>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          © {new Date().getFullYear()} Todos los derechos reservados.
        </Typography>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <IconButton aria-label="GitHub" color="inherit" component={Link} href="https://github.com" target="_blank">
          <GitHub />
        </IconButton>
        <IconButton aria-label="LinkedIn" color="inherit" component={Link} href="https://linkedin.com" target="_blank">
          <LinkedIn />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
