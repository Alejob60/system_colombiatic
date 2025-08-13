import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';
import { useState } from 'react';

const azureServices = [
  "Escritorios Virtuales (Azure Virtual Desktop)",
  "Soluciones DevOps (Azure DevOps)",
  "Integración con Microsoft 365",
  "Inteligencia Artificial (Azure OpenAI)",
  "Bases de Datos (Azure SQL)",
  "Aplicaciones Web (Azure App Service)",
];

interface ServiceSelectorProps {
  onSubmit: (selectedServices: string[]) => void;
}

const ServiceSelector = ({ onSubmit }: ServiceSelectorProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const serviceName = event.target.name;
    if (event.target.checked) {
      setSelected(prev => [...prev, serviceName]);
    } else {
      setSelected(prev => prev.filter(s => s !== serviceName));
    }
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onSubmit(selected);
    }
  };

  return (
    <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Para empezar, dime qué áreas te interesan:
      </Typography>
      <FormGroup>
        {azureServices.map(service => (
          <FormControlLabel
            key={service}
            control={<Checkbox name={service} checked={selected.includes(service)} onChange={handleChange} />}
            label={service}
          />
        ))}
      </FormGroup>
      <Button 
        variant="contained" 
        size="small" 
        onClick={handleSubmit} 
        disabled={selected.length === 0}
        sx={{ mt: 1 }}
      >
        Confirmar Selección
      </Button>
    </Box>
  );
};

export default ServiceSelector;