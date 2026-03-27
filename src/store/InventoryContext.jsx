import { create } from "zustand";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";

const initialTransactions = [
  {
    id: "t1",
    productId: "p1",
    type: "IN",
    quantity: 50,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: "Restock",
  },
  {
    id: "t2",
    productId: "p2",
    type: "OUT",
    quantity: 2,
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: "Sale",
  },
];

const initialSuppliers = [
  {
    id: "1",
    name: "Global Distributing",
    contact: "john@global.com",
    status: "Active",
  },
  {
    id: "2",
    name: "Fresh Farms Agency",
    contact: "orders@freshfarms.inc",
    status: "Active",
  },
];

const calcStats = (prods) => ({
  totalItems: prods.length,
  mismatchItems: prods.filter((p) => p.mismatch > 0).length,
  emptyItems: prods.filter((p) => p.unitQuantity === 0).length,
  totalValue: prods.reduce((sum, p) => sum + p.unitQuantity * p.price, 0),
});

export const useInventory = create((set, get) => ({
  products: [],
  categories: [],
  transactions: initialTransactions,
  suppliers: initialSuppliers,
  stats: { totalItems: 0, mismatchItems: 0, emptyItems: 0, totalValue: 0 },
  loading: false,

  fetchCategories: async () => {
    try {
      const cats = await categoryService.getAllCategories();
      console.log(cats);
      set({ categories: cats });
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      get().fetchCategories();
      const mappedProducts = await productService.getAllProducts();
      set({
        products: mappedProducts,
        stats: calcStats(mappedProducts),
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch products", error);
      set({ loading: false });
    }
  },

  addSupplier: (supplier) =>
    set((state) => ({
      suppliers: [...state.suppliers, { ...supplier, id: `${Date.now()}` }],
    })),

  updateSupplier: (id, updatedFields) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.id === id ? { ...s, ...updatedFields } : s,
      ),
    })),

  addProduct: async (product) => {
    try {
      const data = await productService.addProduct(product);

      if (data.success) {
        // refresh list
        get().fetchProducts();
      } else {
        console.error("Failed to add product", data);
      }
    } catch (error) {
      console.error("Error adding product", error);
    }
  },

  updateProduct: (id, updatedFields) =>
    set((state) => {
      // Note: If you have an update API, put it here.
      const updated = state.products.map((p) =>
        p.id === id ? { ...p, ...updatedFields } : p,
      );
      return { products: updated, stats: calcStats(updated) };
    }),

  addTransaction: (transaction) =>
    set((state) => {
      const newTransaction = {
        ...transaction,
        id: `t${Date.now()}`,
        date: new Date().toISOString(),
      };
      const diff =
        transaction.type === "IN"
          ? transaction.quantity
          : -transaction.quantity;

      const updatedProducts = state.products.map((p) =>
        p.id === transaction.productId
          ? { ...p, unitQuantity: p.unitQuantity + diff }
          : p,
      );

      return {
        transactions: [newTransaction, ...state.transactions],
        products: updatedProducts,
        stats: calcStats(updatedProducts),
      };
    }),
}));
