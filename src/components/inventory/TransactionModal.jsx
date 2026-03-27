import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Box, TextField, Button } from '@mui/material';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TransactionModal({ open, onClose, transactionType, selectedProduct, transactionForm, setTransactionForm, handleSaveTransaction }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
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
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
        <Button onClick={handleSaveTransaction} variant="contained" color={transactionType === 'IN' ? 'success' : 'error'} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}>
          Confirm {transactionType === 'IN' ? 'Stock In' : 'Stock Out'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
