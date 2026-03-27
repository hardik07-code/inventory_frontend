import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Box, TextField, MenuItem, Button } from '@mui/material';
import { Plus, Edit2 } from 'lucide-react';
import { useInventory } from '../../store/InventoryContext';

export default function ProductModal({ open, onClose, selectedProduct, productForm, setProductForm, handleSaveProduct }) {
  const { suppliers, categories } = useInventory();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, bgcolor: 'primary.50', color: 'primary.main', borderRadius: 2, display: 'flex' }}>
          {selectedProduct ? <Edit2 size={24} /> : <Plus size={24} />}
        </Box>
        <Typography variant="h5" fontWeight="800" color="text.primary">
          {selectedProduct ? 'Update Product Details' : 'Register New Product'}
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ borderBottom: 'none', pt: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Details Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary.main" fontWeight="bold" textTransform="uppercase" letterSpacing={1} mb={0}>
              Basic Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth variant="outlined" label="Product Name" placeholder="e.g. Organic Coffee Beans" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth variant="outlined" label="SKU / Barcode" placeholder="e.g. GRO-COF-01" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} />
          </Grid>

          {/* Classification Section */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="primary.main" fontWeight="bold" textTransform="uppercase" letterSpacing={1} mb={0}>
              Classification & Sourcing
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              select 
              fullWidth 
              variant="outlined" 
              label="Category" 
              value={productForm.category || ''} 
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
            >
              {categories && categories.length > 0 ? (
                categories.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))
              ) : (
                <MenuItem disabled value=""><em>No Categories Available</em></MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              select 
              fullWidth 
              variant="outlined" 
              label="Supplier / Agency" 
              value={productForm.supplierId || ''} 
              onChange={(e) => setProductForm({ ...productForm, supplierId: e.target.value })}
            >
              <MenuItem value=""><em>None Selected (Internal)</em></MenuItem>
              {suppliers.map(s => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Inventory Metrics Section */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="primary.main" fontWeight="bold" textTransform="uppercase" letterSpacing={1} mb={0}>
              Pricing & Quantities
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth variant="outlined" type="number" label="Unit Price (₹)" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth variant="outlined" type="number" label="Quantity in a Unit" disabled={!!selectedProduct} value={productForm.unitQuantity} onChange={(e) => setProductForm({ ...productForm, unitQuantity: e.target.value })} helperText={selectedProduct ? "Modifiable via Stock actions" : ""} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth variant="outlined" type="number" label="Dead Stock (Month Wise)" value={productForm.deadStock !== undefined ? productForm.deadStock : 0} onChange={(e) => setProductForm({ ...productForm, deadStock: e.target.value })} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
        <Button onClick={handleSaveProduct} variant="contained" color="primary" sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)' }}>
          {selectedProduct ? 'Update Product' : 'Save Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
