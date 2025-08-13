import { Box, Typography, Paper } from '@mui/material';
import { Security, Speed, IntegrationInstructions, Devices, MonitorHeart, Cloud } from '@mui/icons-material';

const features = [
  {
    icon: <Security fontSize="large" />,
    title: 'Seguridad de Nivel Empresarial',
    description: 'Alojado en una Red Virtual de Azure segura con protección avanzada contra amenazas y políticas de acceso condicional.',
  },
  {
    icon: <Speed fontSize="large" />,
    title: 'Escritorios de Alto Rendimiento',
    description: 'Acceda a potentes VMs optimizadas para desarrollo, diseño o cualquier carga de trabajo exigente.',
  },
  {
    icon: <IntegrationInstructions fontSize="large" />,
    title: 'Integración Completa con Microsoft 365',
    description: 'Incluye licencias de Microsoft 365, con aplicaciones como Office, Teams y Power BI listas para usar.',
  },
  {
    icon: <Devices fontSize="large" />,
    title: 'Optimizado para DevOps',
    description: 'Entornos preconfigurados con VS Code, Docker, Git e integración perfecta con Azure DevOps.',
  },
  {
    icon: <MonitorHeart fontSize="large" />,
    title: 'Monitoreo Proactivo',
    description: 'Usamos Azure Monitor para garantizar el tiempo de actividad y el rendimiento, resolviendo problemas antes de que le afecten.',
  },
  {
    icon: <Cloud fontSize="large" />,
    title: 'Escalabilidad y Flexibilidad',
    description: 'Pague solo por lo que usa y escale fácilmente sus recursos hacia arriba o hacia abajo según cambien sus necesidades.',
  },
];

const Features = () => {
  return (
    <Box sx={{ py: 8 }} id="features">
      <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold">
        Todo lo que Necesitas en una Sola Solución
      </Typography>
      <Box 
        sx={{ 
          mt: 4,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3, // The space between cards
          justifyContent: 'center'
        }}
      >
        {features.map((feature) => (
          <Box 
            key={feature.title}
            sx={{
              flexGrow: 1,
              display: 'flex',
              // On extra-small screens, take full width. On medium screens and up, take roughly half width.
              width: { xs: '100%', md: 'calc(50% - 24px)' }, 
              minWidth: '300px',
            }}
          >
            <Paper elevation={0} sx={{ p: 3, width: '100%', border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ color: 'primary.main', mt: 0.5 }}>
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="h6" component="h3" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Features;