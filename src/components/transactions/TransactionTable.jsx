import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Box } from '@mui/material';
import { TrendingDown, TrendingUp } from 'lucide-react';

export default function TransactionTable({ transactions, getProduct }) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row) => {
            const product = getProduct(row.productId);
            const isOut = row.type === 'OUT';
            return (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                <TableCell>
                  <Typography variant="body2" fontWeight="600">
                    {new Date(row.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="500">
                    {new Date(row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={isOut ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    label={row.type} 
                    size="small" 
                    color={isOut ? 'error' : 'success'} 
                    variant="outlined"
                    sx={{ fontWeight: 'bold', '.MuiChip-icon': { ml: 1 } }} 
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight="700">{product?.name || 'Unknown'}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">SKU: {product?.sku || '-'}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography fontWeight="800" color={isOut ? 'error.main' : 'success.main'}>
                    {isOut ? '-' : '+'}{row.quantity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ bgcolor: 'background.default', px: 1.5, py: 0.5, borderRadius: 1.5, display: 'inline-block' }}>
                    <Typography variant="body2" fontWeight="500" color="text.secondary">{row.notes}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                <Typography variant="h6" color="text.secondary">No transactions found.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
