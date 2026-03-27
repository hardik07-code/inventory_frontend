import { useState, useMemo } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, InputAdornment, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Tooltip } from '@mui/material';
import { Search, Plus, Edit2, Building2 } from 'lucide-react';
import { useInventory } from '../store/InventoryContext';

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [form, setForm] = useState({ name: '', contact: '', status: 'Active' });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setSelectedSupplier(supplier);
      setForm(supplier);
    } else {
      setSelectedSupplier(null);
      setForm({ name: '', contact: '', status: 'Active' });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, form);
    } else {
      addSupplier(form);
    }
    setModalOpen(false);
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Building2 size={28} />
            Agencies & Suppliers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage the agencies providing your inventory.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenModal()}
        >
          Add Supplier
        </Button>
      </Box>

      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            placeholder="Search suppliers by name or contact..."
            variant="outlined"
            size="small"
            sx={{ width: { xs: '100%', md: 400 } }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Agency Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                  <TableCell>
                    <Typography fontWeight="700">{row.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">{row.contact}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.status} 
                      color={row.status === 'Active' ? 'success' : 'default'} 
                      size="small" 
                      variant={row.status === 'Active' ? 'filled' : 'outlined'}
                      sx={{ fontWeight: 'bold' }} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Supplier">
                      <IconButton size="small" onClick={() => handleOpenModal(row)} sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                        <Edit2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No suppliers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
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
          <Button onClick={() => setModalOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary" sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)' }}>
            {selectedSupplier ? 'Update Supplier' : 'Save Supplier'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
