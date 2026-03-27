import { create } from 'zustand';

const initialProducts = [
  { id: 'p1', name: 'Organic Coffee Beans', sku: 'GRO-COF-01', category: 'Groceries', unitQuantity: 45, mismatch: 0, price: 12.99 },
  { id: 'p2', name: 'Almond Milk (1L)', sku: 'GRO-ALM-02', category: 'Groceries', unitQuantity: 8, mismatch: 2, price: 4.49 },
  { id: 'p3', name: 'Eco-Friendly Detergent', sku: 'CLN-DET-01', category: 'Cleaning', unitQuantity: 12, mismatch: 0, price: 15.00 },
  { id: 'p4', name: 'AA Batteries (4-pack)', sku: 'ELC-BAT-01', category: 'Electronics', unitQuantity: 0, mismatch: 0, price: 5.99 },
  { id: 'p5', name: 'Whole Wheat Bread', sku: 'BAK-BRD-01', category: 'Bakery', unitQuantity: 25, mismatch: 1, price: 3.49 },
];

const initialTransactions = [
  { id: 't1', productId: 'p1', type: 'IN', quantity: 50, date: new Date(Date.now() - 86400000 * 2).toISOString(), notes: 'Restock' },
  { id: 't2', productId: 'p2', type: 'OUT', quantity: 2, date: new Date(Date.now() - 86400000 * 1).toISOString(), notes: 'Sale' },
  { id: 't3', productId: 'p4', type: 'OUT', quantity: 5, date: new Date().toISOString(), notes: 'Sale' },
];

const initialSuppliers = [
  { id: 's1', name: 'Global Distributing', contact: 'john@global.com', status: 'Active' },
  { id: 's2', name: 'Fresh Farms Agency', contact: 'orders@freshfarms.inc', status: 'Active' },
];

const calcStats = (prods) => ({
  totalItems: prods.length,
  mismatchItems: prods.filter(p => p.mismatch > 0).length,
  emptyItems: prods.filter(p => p.unitQuantity === 0).length,
  totalValue: prods.reduce((sum, p) => sum + (p.unitQuantity * p.price), 0)
});

export const useInventory = create((set) => ({
  products: initialProducts,
  transactions: initialTransactions,
  suppliers: initialSuppliers,
  stats: calcStats(initialProducts),

  addSupplier: (supplier) => set((state) => ({
    suppliers: [...state.suppliers, { ...supplier, id: `s${Date.now()}` }]
  })),

  updateSupplier: (id, updatedFields) => set((state) => ({
    suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updatedFields } : s)
  })),

  addProduct: (product) => set((state) => {
    const updated = [...state.products, { ...product, id: `p${Date.now()}` }];
    return { products: updated, stats: calcStats(updated) };
  }),

  updateProduct: (id, updatedFields) => set((state) => {
    const updated = state.products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    return { products: updated, stats: calcStats(updated) };
  }),

  addTransaction: (transaction) => set((state) => {
    const newTransaction = { ...transaction, id: `t${Date.now()}`, date: new Date().toISOString() };
    const diff = transaction.type === 'IN' ? transaction.quantity : -transaction.quantity;
    
    const updatedProducts = state.products.map(p => 
      p.id === transaction.productId ? { ...p, unitQuantity: p.unitQuantity + diff } : p
    );

    return {
      transactions: [newTransaction, ...state.transactions],
      products: updatedProducts,
      stats: calcStats(updatedProducts)
    };
  })
}));
