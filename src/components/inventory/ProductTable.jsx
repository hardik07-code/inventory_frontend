import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, IconButton, Box, Tooltip } from '@mui/material';
import { Edit2, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useInventory } from '../../store/InventoryContext';

export default function ProductTable({ products, handleOpenProductModal, handleOpenTransactionModal }) {
  const { suppliers } = useInventory();

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Product Details</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Quantity in a Unit</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Quick Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((row) => (
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
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
