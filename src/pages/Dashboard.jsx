import { Box, Typography, Grid, Card, CardContent, Chip, Divider } from '@mui/material';
import { Package, AlertCircle, AlertTriangle } from 'lucide-react';
import { useInventory } from '../store/InventoryContext';

export default function Dashboard() {
  const { stats, products, transactions } = useInventory();

  const getProduct = (id) => products.find(p => p.id === id);

  return (
    <Box sx={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      {/* Welcome Banner */}
      <Box sx={{
        mb: 4,
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight="800" mb={1}>
            Welcome back, Admin!
          </Typography>
          <Typography variant="h6" fontWeight="400" sx={{ opacity: 0.9 }}>
            Here is what's happening with your store today.
          </Typography>
        </Box>
        {/* Decorative circle */}
        <Box sx={{
          position: 'absolute', right: '-5%', top: '-50%', width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0
        }} />
      </Box>

      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Units Tracked"
            value={stats.totalItems?.toString() || '0'}
            icon={<Package size={28} color="#4f46e5" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Order Mismatches"
            value={stats.mismatchItems?.toString() || '0'}
            icon={<AlertTriangle size={28} color="#f59e0b" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Empty Units"
            value={stats.emptyItems?.toString() || '0'}
            icon={<AlertCircle size={28} color="#ef4444" />}
            color="error"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, p: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <Typography variant="h6" fontWeight="bold" color="warning.main" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AlertTriangle size={20} /> Order Mismatch Alerts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {products.filter(p => p.mismatch > 0).slice(0, 5).map(product => (
                <Box key={product.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#fffbeb', borderRadius: 2 }}>
                  <Box>
                    <Typography fontWeight="bold">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">SKU: {product.sku}</Typography>
                  </Box>
                  <Chip 
                    label={`${product.mismatch} Mismatch`} 
                    color="warning" 
                    size="small" 
                    sx={{ fontWeight: 'bold' }} 
                  />
                </Box>
              ))}
              {products.filter(p => p.mismatch > 0).length === 0 && (
                <Typography color="text.secondary">No order mismatches reported!</Typography>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, p: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <Typography variant="h6" fontWeight="bold" color="error.main" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AlertCircle size={20} /> Empty Units
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {products.filter(p => p.unitQuantity === 0).slice(0, 5).map(product => (
                <Box key={product.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#fef2f2', borderRadius: 2 }}>
                  <Box>
                    <Typography fontWeight="bold">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">SKU: {product.sku}</Typography>
                  </Box>
                  <Chip 
                    label="Empty" 
                    color="error"
                    size="small" 
                    sx={{ fontWeight: 'bold' }} 
                  />
                </Box>
              ))}
              {products.filter(p => p.unitQuantity === 0).length === 0 && (
                <Typography color="text.secondary">No units are completely empty.</Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ borderTop: `4px solid`, borderTopColor: `${color}.main`, height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 3 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="900" color="text.primary" letterSpacing="-0.02em">
            {value}
          </Typography>
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 3, display: 'flex', bgcolor: `${color}.50`, color: `${color}.main` }}>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
}
