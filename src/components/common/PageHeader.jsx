import { Box, Typography, Button } from '@mui/material';

export default function PageHeader({ title, description, icon: Icon, actionButton }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {Icon && <Icon size={28} />}
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {actionButton && (
        <Button 
          variant={actionButton.variant || "contained"} 
          color={actionButton.color || "primary"} 
          startIcon={actionButton.icon}
          onClick={actionButton.onClick}
        >
          {actionButton.label}
        </Button>
      )}
    </Box>
  );
}
