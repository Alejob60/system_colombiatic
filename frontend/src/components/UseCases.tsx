import { Box, Typography, Card, CardContent } from '@mui/material';
import {
  Code,
  DesignServices,
  Business,
  SupportAgent,
  ShoppingCart,
  Campaign,
  Groups,
  CloudUpload,
  Schedule,
  Insights,
} from '@mui/icons-material';

const useCases = [
  {
    icon: <Code fontSize="large" color="primary" />,
    title: 'Equipos de Desarrollo',
    description: 'Entornos seguros y estandarizados para programadores, accesibles desde cualquier lugar.',
  },
  {
    icon: <DesignServices fontSize="large" color="primary" />,
    title: 'Agencias de Diseño',
    description: 'Ejecución de software pesado de diseño sin necesidad de hardware local costoso.',
  },
  {
    icon: <Business fontSize="large" color="primary" />,
    title: 'Empresas Remotas',
    description: 'Trabajo seguro y productivo desde casa o en viajes con escritorios virtuales consistentes.',
  },
  {
    icon: <SupportAgent fontSize="large" color="primary" />,
    title: 'Atención al Cliente con IA',
    description: 'Chatbots y agentes virtuales que atienden 24/7 en múltiples canales como WhatsApp y Facebook.',
  },
  {
    icon: <ShoppingCart fontSize="large" color="primary" />,
    title: 'Ventas Automatizadas',
    description: 'Automatización de prospección y seguimiento de clientes potenciales con inteligencia artificial.',
  },
  {
    icon: <Campaign fontSize="large" color="primary" />,
    title: 'Marketing en Redes Sociales',
    description: 'Publicación automática de videos, imágenes y audio con calendario y analítica integrada.',
  },
  {
    icon: <Groups fontSize="large" color="primary" />,
    title: 'Captación de Audiencias',
    description: 'Creación de campañas virales optimizadas para máximo alcance y engagement.',
  },
  {
    icon: <CloudUpload fontSize="large" color="primary" />,
    title: 'Gestión de Contenido',
    description: 'Centraliza la carga y programación de contenido en múltiples plataformas.',
  },
  {
    icon: <Schedule fontSize="large" color="primary" />,
    title: 'Planificación de Publicaciones',
    description: 'Genera calendarios de marketing y ventas para organizar la estrategia del mes.',
  },
  {
    icon: <Insights fontSize="large" color="primary" />,
    title: 'Análisis y Optimización',
    description: 'Uso de analítica avanzada para mejorar campañas y rendimiento comercial.',
  },
];

const UseCases = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'grey.100' }} id="use-cases">
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        align="center"
        fontWeight="bold"
      >
        Casos de Uso para tu Negocio
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 3,
          mt: 4,
        }}
      >
        {useCases.map((useCase) => (
          <Card
            key={useCase.title}
            sx={{
              width: { xs: '100%', sm: 300 },
              maxWidth: 345, // Max width to avoid looking too large on some screens
              textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {useCase.icon}
              <Typography
                variant="h6"
                component="h3"
                fontWeight="bold"
                sx={{ mt: 2 }}
              >
                {useCase.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {useCase.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default UseCases;