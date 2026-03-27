import { useState, useMemo, useEffect } from 'react';
import { Box, Card, TextField, InputAdornment } from '@mui/material';
import { Search, Plus, ListChecks } from 'lucide-react';
import { useInventory } from '../store/InventoryContext';
import PageHeader from '../components/common/PageHeader';
import ProductTable from '../components/inventory/ProductTable';
import ProductModal from '../components/inventory/ProductModal';
import TransactionModal from '../components/inventory/TransactionModal';

export default function Inventory() {
  const { products, addProduct, updateProduct, addTransaction, fetchProducts } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  
  // modal open/close checks
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transactionType, setTransactionType] = useState('IN');

  // form data
  const [productForm, setProductForm] = useState({ name: '', sku: '', category: '', price: 0, unitQuantity: 0, supplierId: '', deadStock: 0 });
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
      setProductForm({ name: '', sku: '', category: '', price: 0, unitQuantity: 0, supplierId: '', deadStock: 0 });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!selectedProduct) {
      const existingProduct = products.find(p => 
        (p.name.toLowerCase() === productForm.name.toLowerCase() || p.sku.toLowerCase() === productForm.sku.toLowerCase()) && p.deadStock > 0
      );
      if (existingProduct) {
        if (!window.confirm(`This product is also ${existingProduct.deadStock} items in dead stock. Do you want to proceed?`)) {
          return;
        }
      }
    }

    if (selectedProduct) {
      updateProduct(selectedProduct.id, { ...productForm, deadStock: Number(productForm.deadStock) || 0 });
    } else {
      addProduct({ ...productForm, price: Number(productForm.price), unitQuantity: Number(productForm.unitQuantity), deadStock: Number(productForm.deadStock) || 0 });
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
      <PageHeader 
        title="Products Inventory"
        description="Manage your units and add new products."
        icon={ListChecks}
        actionButton={{
          label: "Add Product",
          icon: <Plus size={20} />,
          onClick: () => handleOpenProductModal()
        }}
      />

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
        <ProductTable 
          products={filteredProducts} 
          handleOpenProductModal={handleOpenProductModal}
          handleOpenTransactionModal={handleOpenTransactionModal}
        />
      </Card>

      <ProductModal 
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        selectedProduct={selectedProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        handleSaveProduct={handleSaveProduct}
      />

      <TransactionModal 
        open={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        transactionType={transactionType}
        selectedProduct={selectedProduct}
        transactionForm={transactionForm}
        setTransactionForm={setTransactionForm}
        handleSaveTransaction={handleSaveTransaction}
      />
    </Box>
  );
}
