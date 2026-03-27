import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SupplierTable({ suppliers, handleOpenModal }) {
  const navigate = useNavigate();

  return (
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
          {suppliers.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
              <TableCell 
                onClick={() => navigate(`/suppliers/${row.id}/balance-sheet`)}
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              >
                <Typography fontWeight="700" sx={{ textDecoration: 'underline', textUnderlineOffset: 4, textDecorationColor: 'rgba(0,0,0,0.2)' }}>{row.name}</Typography>
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
          {suppliers.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                No suppliers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
