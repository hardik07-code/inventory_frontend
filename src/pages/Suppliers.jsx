import { useState, useMemo } from 'react';
import { Box, Card, TextField, InputAdornment } from '@mui/material';
import { Search, Plus, Building2 } from 'lucide-react';
import { useInventory } from '../store/InventoryContext';
import PageHeader from '../components/common/PageHeader';
import SupplierTable from '../components/suppliers/SupplierTable';
import SupplierModal from '../components/suppliers/SupplierModal';


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
      <PageHeader 
        title="Agencies & Suppliers"
        description="Manage the agencies providing your inventory."
        icon={Building2}
        actionButton={{
          label: "Add Supplier",
          icon: <Plus size={20} />,
          onClick: () => handleOpenModal()
        }}
      />

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
        <SupplierTable 
          suppliers={filteredSuppliers} 
          handleOpenModal={handleOpenModal} 
        />
      </Card>

      <SupplierModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedSupplier={selectedSupplier}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </Box>
  );
}
