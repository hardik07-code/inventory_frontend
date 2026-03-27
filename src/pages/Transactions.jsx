import { useState, useMemo } from 'react';
import { Box, Typography, Card, TextField, InputAdornment, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Search, TrendingDown, TrendingUp, History } from 'lucide-react';
import { useInventory } from '../store/InventoryContext';

export default function Transactions() {
  const { transactions, products } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: IN, 2: OUT

  const getProduct = (id) => products.find(p => p.id === id);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // tab filter
      if (activeTab === 1 && t.type !== 'IN') return false;
      if (activeTab === 2 && t.type !== 'OUT') return false;

      // search filter
      const p = getProduct(t.productId);
      const searchStr = searchTerm.toLowerCase();
      return (
        t.id.toLowerCase().includes(searchStr) ||
        (p && p.name.toLowerCase().includes(searchStr)) ||
        (p && p.sku.toLowerCase().includes(searchStr)) ||
        (t.notes || '').toLowerCase().includes(searchStr)
      );
    });
  }, [transactions, products, searchTerm, activeTab]);

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <History size={28} />
          Transaction Logs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track all stock movements, sales, and restocks.
        </Typography>
      </Box>

      {/* Tabs and Search */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)} 
            textColor="primary" 
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Merged" sx={{ fontWeight: 700 }} />
            <Tab label="Stock IN (Restock)" sx={{ color: 'success.main', fontWeight: 600, '&.Mui-selected': { color: 'success.dark' } }} />
            <Tab label="Stock OUT (Sales)" sx={{ color: 'error.main', fontWeight: 600, '&.Mui-selected': { color: 'error.dark' } }} />
          </Tabs>

          <TextField
            placeholder="Search logs..."
            variant="outlined"
            size="small"
            sx={{ width: { xs: '100%', md: 300 } }}
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
      </Card>

      <Card sx={{ borderRadius: 3 }}>
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
              {filteredTransactions.map((row) => {
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
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="text.secondary">No transactions found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
