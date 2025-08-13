import { useRef, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  InputLabel,
  FormControl,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

const azureServices = [
  "Azure Virtual Machines (VM)",
  "Azure App Service (Web Apps)",
  "Azure Blob Storage",
  "Azure Cognitive Services (IA, Vision, NLP)",
  "Azure OpenAI",
  "Azure Kubernetes Service (AKS)",
  "Azure Virtual Desktop",
  "Azure SQL Database",
  "Azure DevOps",
  "Azure Service Bus",
  "Azure Media Services (Streaming/Video)",
  "Azure Functions (Serverless)"
];

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<{
    severity: 'success' | 'error';
    message: string;
  }>({ severity: 'success', message: '' });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleServiceChange = (event: SelectChangeEvent<typeof selectedServices>) => {
    const {
      target: { value },
    } = event;
    setSelectedServices(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const sendFormToServer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: { [key: string]: unknown } = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    // Manually add the services from the state
    data.selected_services = selectedServices.join(', ');

    try {
      const response = await fetch('http://localhost:7071/api/contact-form-handler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setAlert({
          severity: 'success',
          message: '¡Mensaje enviado con éxito! Nos pondremos en contacto con usted en breve.',
        });
        setOpen(true);
        form.current?.reset();
        setSelectedServices([]);
      } else {
        throw new Error('El servidor respondió con un error.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setAlert({
        severity: 'error',
        message: 'Error al enviar el mensaje. Por favor, inténtelo de nuevo más tarde.',
      });
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 } }} id="contact">
      <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: 3, boxShadow: 6 }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold" color="primary">
            Solicite una Cotización Personalizada
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Complete el formulario y nuestro equipo le enviará una propuesta adaptada a sus necesidades.
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Box component="form" ref={form} onSubmit={sendFormToServer}>
            {/* This hidden input is the key to making sendForm work with our custom Select component */}
            <input type="hidden" name="selected_services" value={selectedServices.join(', ')} />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <TextField name="from_name" label="Nombre Completo" variant="outlined" fullWidth required />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <TextField name="company_name" label="Nombre de la Empresa" variant="outlined" fullWidth required />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <TextField name="from_email" label="Correo Electrónico" variant="outlined" fullWidth required type="email" />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                <TextField name="from_phone" label="Teléfono" variant="outlined" fullWidth required />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField name="company_nit" label="NIT / ID Fiscal" variant="outlined" fullWidth required />
              </Box>
              <Box sx={{ width: '100%' }}>
                <FormControl fullWidth>
                  <InputLabel id="services-select-label">Servicios de Interés (selección múltiple)</InputLabel>
                  <Select
                    labelId="services-select-label"
                    multiple
                    value={selectedServices}
                    onChange={handleServiceChange}
                    input={<OutlinedInput label="Servicios de Interés (selección múltiple)" />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {azureServices.map((service) => (
                      <MenuItem key={service} value={service}>
                        <Checkbox checked={selectedServices.indexOf(service) > -1} />
                        <ListItemText primary={service} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  name="requirements"
                  label="Requerimientos y necesidades"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Ej: Necesitamos una base de datos para 10,000 usuarios concurrentes..."
                  required
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  name="deployments"
                  label="Número de despliegues"
                  variant="outlined"
                  fullWidth
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  required
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField name="message" label="Mensaje Adicional (Opcional)" variant="outlined" fullWidth multiline rows={4} />
              </Box>
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ minWidth: 200, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}>
                  {loading ? <CircularProgress size={24} /> : 'Enviar Solicitud'}
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Recibirá la cotización y el enlace de pago en su correo. <br />
                  La infraestructura estará disponible en 2 horas tras la confirmación. Ofrecemos <strong>garantía de 1 mes</strong>.
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactForm;