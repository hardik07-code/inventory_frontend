import { useState, useMemo } from 'react';
import { Box, Card, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { Search, History } from 'lucide-react';
import { useInventory } from '../store/InventoryContext';
import PageHeader from '../components/common/PageHeader';
import TransactionTable from '../components/transactions/TransactionTable';

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
      <PageHeader 
        title="Transaction Logs"
        description="Track all stock movements, sales, and restocks."
        icon={History}
      />

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
        <TransactionTable 
          transactions={filteredTransactions} 
          getProduct={getProduct}
        />
      </Card>
    </Box>
  );
}
