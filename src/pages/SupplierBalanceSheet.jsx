import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from '@mui/material';
import { ArrowLeft, Receipt } from 'lucide-react';
import { useInventory } from '../store/InventoryContext';
import PageHeader from '../components/common/PageHeader';

const mockLedger = [
  { id: 1, date: '1 Apr', description: 'Purchased Goods', debit: null, credit: 10000, balance: 10000 },
  { id: 2, date: '5 Apr', description: 'Payment Made', debit: 4000, credit: null, balance: 6000 },
  { id: 3, date: '10 Apr', description: 'Purchased Goods', debit: null, credit: 5000, balance: 11000 },
  { id: 4, date: '15 Apr', description: 'Payment Made', debit: 6000, credit: null, balance: 5000 },
];

export default function SupplierBalanceSheet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { suppliers } = useInventory();

  const supplier = useMemo(() => {
    return suppliers.find(s => s.id === id);
  }, [suppliers, id]);

  if (!supplier) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Supplier not found.</Typography>
        <Button startIcon={<ArrowLeft />} onClick={() => navigate('/suppliers')} sx={{ mt: 2 }}>
          Back to Suppliers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/suppliers')} sx={{ mr: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
          <ArrowLeft size={20} />
        </IconButton>
        <Box sx={{ flex: 1, ml: 1 }}>
          <PageHeader 
            title="Balance Sheet"
            description={`Ledger for ${supplier.name}`}
            icon={Receipt}
          />
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Debit (₹)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Credit (₹)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockLedger.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>
                    {row.debit ? row.debit.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'success.main', fontWeight: 500 }}>
                    {row.credit ? row.credit.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {row.balance.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
