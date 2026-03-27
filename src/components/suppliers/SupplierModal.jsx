import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { Plus, Edit2 } from 'lucide-react';

export default function SupplierModal({ open, onClose, selectedSupplier, form, setForm, handleSave }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, bgcolor: 'primary.50', color: 'primary.main', borderRadius: 2, display: 'flex' }}>
          {selectedSupplier ? <Edit2 size={24} /> : <Plus size={24} />}
        </Box>
        <Typography variant="h5" fontWeight="800" color="text.primary">
          {selectedSupplier ? 'Update Supplier Profile' : 'Register New Supplier'}
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ borderBottom: 'none', pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth variant="outlined" label="Agency / Supplier Name" placeholder="e.g. Global Distributing" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth variant="outlined" label="Contact Information" placeholder="Email or Phone Number" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={4}>
             <TextField
                select
                fullWidth
                variant="outlined"
                label="Partnership Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)' }}>
          {selectedSupplier ? 'Update Supplier' : 'Save Supplier'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
