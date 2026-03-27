import { useState, useMemo } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, InputAdornment, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Tooltip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Search, Plus, Edit2, AlertTriangle, ArrowUpRight, ArrowDownRight, Archive } from 'lucide-react';
import { useInventory } from '../store/InventoryContext';

export default function Inventory() {
  const { products, suppliers, addProduct, updateProduct, addTransaction } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  
  // modal open/close checks
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transactionType, setTransactionType] = useState('IN');

  // form data
  const [productForm, setProductForm] = useState({ name: '', sku: '', category: '', price: 0, unitQuantity: 0, mismatch: 0, supplierId: '' });
  const [transactionForm, setTransactionForm] = useState({ quantity: 1, notes: '' });

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setProductForm(product);
    } else {
      setSelectedProduct(null);
      setProductForm({ name: '', sku: '', category: '', price: 0, unitQuantity: 0, mismatch: 0, supplierId: '' });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, productForm);
    } else {
      addProduct({ ...productForm, price: Number(productForm.price), unitQuantity: Number(productForm.unitQuantity), mismatch: Number(productForm.mismatch) });
    }
    setProductModalOpen(false);
  };

  const handleOpenTransactionModal = (product, type) => {
    setSelectedProduct(product);
    setTransactionType(type);
    setTransactionForm({ quantity: 1, notes: type === 'IN' ? 'Stock Refill' : 'Sales / Adjustment' });
    setTransactionModalOpen(true);
  };

  const handleSaveTransaction = () => {
    addTransaction({
      productId: selectedProduct.id,
      type: transactionType,
      quantity: Number(transactionForm.quantity),
      notes: transactionForm.notes
    });
    setTransactionModalOpen(false);
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1}>
            Products Inventory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your units, track mismatches, and add new products.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenProductModal()}
        >
          Add Product
        </Button>
      </Box>

      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            placeholder="Search products by name or SKU..."
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
                <TableCell sx={{ fontWeight: 'bold' }}>Product Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Quantity in a Unit</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Order Mismatch</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Quick Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                  <TableCell>
                    <Typography fontWeight="600">{row.name}</Typography>
                    <Typography variant="body2" color="text.secondary">SKU: {row.sku}{row.supplierId && ` • Supplier: ${suppliers.find(s => s.id === row.supplierId)?.name || 'Unknown'}`}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={row.category} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold" fontSize="1.1rem" color={row.unitQuantity === 0 ? 'error.main' : 'text.primary'}>
                      {row.unitQuantity}
                    </Typography>
                    {row.unitQuantity === 0 && (
                      <Chip label="Empty Units" color="error" size="small" sx={{ mt: 0.5 }} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {row.mismatch > 0 ? (
                      <Chip label={`${row.mismatch} Missing`} color="warning" size="small" icon={<AlertTriangle size={14} />} />
                    ) : (
                      <Typography variant="body2" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Stock In">
                        <IconButton size="small" color="success" onClick={() => handleOpenTransactionModal(row, 'IN')} sx={{ border: '1px solid', borderColor: 'success.main', '&:hover': { bgcolor: 'success.50' }}}>
                          <ArrowDownRight size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Stock Out">
                         <IconButton size="small" color="error" onClick={() => handleOpenTransactionModal(row, 'OUT')} sx={{ border: '1px solid', borderColor: 'error.main', '&:hover': { bgcolor: 'error.50' }}}>
                          <ArrowUpRight size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Product">
                        <IconButton size="small" onClick={() => handleOpenProductModal(row)} sx={{ border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                          <Edit2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* premium product popup */}
      <Dialog open={productModalOpen} onClose={() => setProductModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
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
                <MenuItem value="Groceries">Groceries</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Cleaning">Cleaning</MenuItem>
                <MenuItem value="Bakery">Bakery</MenuItem>
                <MenuItem value="Beverages">Beverages</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
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
            <Grid item xs={12} sm={4}>
              <TextField fullWidth variant="outlined" type="number" label="Unit Price (₹)" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth variant="outlined" type="number" label="Quantity in a Unit" disabled={!!selectedProduct} value={productForm.unitQuantity} onChange={(e) => setProductForm({ ...productForm, unitQuantity: e.target.value })} helperText={selectedProduct ? "Modifiable via Stock actions" : ""} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth variant="outlined" type="number" label="Order Mismatch (-)" value={productForm.mismatch} onChange={(e) => setProductForm({ ...productForm, mismatch: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setProductModalOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" color="primary" sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)' }}>
            {selectedProduct ? 'Update Product' : 'Save Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* premium stock popup */}
      <Dialog open={transactionModalOpen} onClose={() => setTransactionModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <Box sx={{ p: 1, bgcolor: transactionType === 'IN' ? 'success.50' : 'error.50', color: transactionType === 'IN' ? 'success.main' : 'error.main', borderRadius: 2, display: 'flex' }}>
            {transactionType === 'IN' ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
          </Box>
          <Typography variant="h5" fontWeight="800" color="text.primary">
            {transactionType === 'IN' ? 'Stock In (Restock units)' : 'Stock Out (Sale or Adjustment)'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: 'none', pt: 3 }}>
          {selectedProduct && (
            <Box mb={3} p={2} sx={{ bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography fontWeight="bold" variant="h6">{selectedProduct.name}</Typography>
              <Typography variant="body2" color="text.secondary">Current Units Available: <Box component="span" fontWeight="bold" color="text.primary">{selectedProduct.unitQuantity}</Box></Typography>
            </Box>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth
                variant="outlined" 
                type="number" 
                label="Number of Units to adjust" 
                value={transactionForm.quantity} 
                onChange={(e) => setTransactionForm({ ...transactionForm, quantity: e.target.value })} 
                inputProps={{ min: 1, max: transactionType === 'OUT' ? selectedProduct?.unitQuantity : undefined }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth
                variant="outlined" 
                multiline
                rows={2}
                label="Notes / Reason for Adjustment" 
                value={transactionForm.notes} 
                onChange={(e) => setTransactionForm({ ...transactionForm, notes: e.target.value })} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setTransactionModalOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button onClick={handleSaveTransaction} variant="contained" color={transactionType === 'IN' ? 'success' : 'error'} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}>
            Confirm {transactionType === 'IN' ? 'Stock In' : 'Stock Out'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
