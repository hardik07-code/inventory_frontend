# Inventory UI — Frontend Documentation

This document provides a complete explanation of the **Inventory Management System** frontend, including its architecture, API integration layer, state management, component design, and user flows.

---

## 1. Project Overview

The frontend is a **React SPA** (Single Page Application) built with:

| Technology | Purpose |
|---|---|
| **React 18+** | UI library (functional components & hooks) |
| **Vite** | Build tool & dev server |
| **Material-UI (MUI)** | Component library for premium UI elements |
| **Zustand** | Lightweight global state management |
| **Axios** | HTTP client for REST API calls |
| **Lucide-React** | Lightweight SVG icon library |
| **React Router v6** | Client-side routing & navigation |

---

## 2. Directory Structure

```text
src/
├── components/              # Reusable UI components
│   ├── common/              # Shared across pages
│   │   └── PageHeader.jsx       # Reusable page title + action button
│   ├── inventory/           # Inventory page components
│   │   ├── ProductTable.jsx     # Product listing table
│   │   ├── ProductModal.jsx     # Add/Edit product dialog
│   │   └── TransactionModal.jsx # Stock In/Out dialog
│   ├── suppliers/           # Supplier page components
│   │   ├── SupplierTable.jsx
│   │   └── SupplierModal.jsx
│   └── transactions/        # Transaction log components
│       └── TransactionTable.jsx
├── pages/                   # Route-level page views
│   ├── Dashboard.jsx            # Overview stats & alerts
│   ├── Inventory.jsx            # Product management page
│   ├── Login.jsx                # Authentication page
│   ├── Reports.jsx              # Report generation & export
│   ├── Suppliers.jsx            # Supplier management page
│   └── Transactions.jsx        # Transaction history page
├── services/                # API service layer
│   ├── api.js                   # Axios instance + interceptors
│   ├── productService.js        # Product API methods
│   └── categoryService.js       # Category API methods
├── store/                   # Global state (Zustand stores)
│   ├── AuthContext.jsx          # Authentication store
│   └── InventoryContext.jsx     # Core inventory store
├── theme/
│   └── index.js                 # MUI theme configuration
├── App.jsx                  # Root component with routes
├── main.jsx                 # React entry point
└── index.css                # Global CSS
```

---

## 3. API Service Layer (`services/`)

The API layer is cleanly separated from UI components. All HTTP calls go through a shared Axios instance.

### 3.1 `api.js` — Axios Instance & Interceptors

This is the single Axios instance used by all services.

```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
});
```

**Request Interceptor** — Automatically attaches the JWT token (from `localStorage`) to every outgoing request:
```javascript
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor** — Catches `401 Unauthorized` errors globally for session expiry handling:
```javascript
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle logout or token refresh
    }
    return Promise.reject(error);
  }
);
```

---

### 3.2 `productService.js` — Product API Methods

| Method | HTTP | Endpoint | Description |
|---|---|---|---|
| `getAllProducts()` | `GET` | `/products/getAllProducts` | Fetches all products and maps backend DTOs to frontend model |
| `addProduct(product)` | `POST` | `/products/addProduct` | Creates a new product with the mapped payload |

**Backend → Frontend mapping** (`getAllProducts`):
```
Backend DTO          →  Frontend Model
─────────────────────────────────────
p.id                 →  id
p.productName        →  name
p.sku                →  sku
p.categoryName       →  category
p.quantity           →  unitQuantity
p.price              →  price (Number)
(hardcoded 0)        →  mismatch
(null)               →  supplierId
```

**Frontend → Backend mapping** (`addProduct`):
```
Frontend Model       →  Backend Payload
─────────────────────────────────────
product.name         →  productName
product.category     →  categoryId (Number)
product.sku          →  sku
product.unitQuantity →  unit (Number)
product.supplierId   →  supplierId (Number)
product.price        →  pricePerQuantity (Number)
(hardcoded 5)        →  minStock
(hardcoded 1)        →  quantityPerUnit
```

---

### 3.3 `categoryService.js` — Category API Methods

| Method | HTTP | Endpoint | Description |
|---|---|---|---|
| `getAllCategories()` | `GET` | `/categories/getAllCategories` | Fetches all categories for product classification |

**Backend → Frontend mapping**:
```
Backend DTO          →  Frontend Model
─────────────────────────────────────
c.id                 →  id
c.categoryname       →  name
```

> **Note:** The backend returns `categoryname` (all lowercase), not `categoryName`.

---

## 4. State Management (`store/`)

State is managed using **Zustand** — a minimal, hook-based state manager (no Providers or Context wrappers needed).

### 4.1 `InventoryContext.jsx` — Core Business Store

This is the main store powering the entire app. Components access it via:
```javascript
const { products, categories, ... } = useInventory();
```

#### State Shape

| State Key | Type | Source | Description |
|---|---|---|---|
| `products` | `Array` | API (`fetchProducts`) | List of all products |
| `categories` | `Array` | API (`fetchCategories`) | List of all categories |
| `transactions` | `Array` | Initial seed data | Stock in/out transaction logs |
| `suppliers` | `Array` | Initial seed data | Supplier/agency records |
| `stats` | `Object` | Computed from `products` | Dashboard statistics |
| `loading` | `Boolean` | Internal | Loading state for products |

#### Actions (Methods)

| Action | Type | Description |
|---|---|---|
| `fetchProducts()` | `async` | Calls `productService.getAllProducts()`, also triggers `fetchCategories()`. Updates `products`, `stats`, and `loading`. |
| `fetchCategories()` | `async` | Calls `categoryService.getAllCategories()`. Updates `categories`. |
| `addProduct(product)` | `async` | Calls `productService.addProduct()`. On success, auto-refreshes via `fetchProducts()`. |
| `updateProduct(id, fields)` | `sync` | Updates a product locally in state (no backend API yet). |
| `addSupplier(supplier)` | `sync` | Adds a new supplier to local state. |
| `updateSupplier(id, fields)` | `sync` | Updates a supplier in local state. |
| `addTransaction(txn)` | `sync` | Adds a stock in/out transaction and adjusts product quantity locally. |

#### Data Flow Diagram

```
┌──────────────┐    fetchProducts()      ┌───────────────────┐
│  Inventory   │ ─────────────────────►  │  productService   │
│  Page loads  │                         │  .getAllProducts() │
│  (useEffect) │                         └────────┬──────────┘
└──────┬───────┘                                  │
       │                                          ▼
       │  also triggers               ┌───────────────────┐
       │  fetchCategories()           │   Backend API      │
       │ ─────────────────────►       │   /api/v1/products │
       │                              └────────┬──────────┘
       │                                       │
       ▼                                       ▼
  ┌─────────────────────────────────────────────────────┐
  │              Zustand Store (useInventory)            │
  │  products: [...], categories: [...], stats: {...}    │
  └───────────────────────┬─────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ProductTable     ProductModal      Dashboard
   (reads products) (reads categories) (reads stats)
```

#### Stats Calculation

Stats are auto-computed whenever products change using `calcStats()`:
```javascript
{
  totalItems:    products.length,
  mismatchItems: products.filter(p => p.mismatch > 0).length,
  emptyItems:    products.filter(p => p.unitQuantity === 0).length,
  totalValue:    Σ(unitQuantity × price)
}
```

---

### 4.2 `AuthContext.jsx` — Authentication Store

A simple Zustand store managing login state with `localStorage` persistence.

| Action | Description |
|---|---|
| `login(email, password)` | Creates a fake user object, stores in `localStorage`, sets `user` state |
| `logout()` | Clears `user` from state and `localStorage` |

> **Note:** Authentication is currently placeholder/fake — it accepts any email/password.

**Route Protection:**
`App.jsx` uses a `ProtectedRoute` component that checks `useAuth().user`. Unauthenticated users are redirected to `/login`.

---

## 5. Component Architecture

### 5.1 Pages (Container Components)

Pages act as **orchestrators** — they connect global state to presentational components.

| Page | Role | Key State/Actions Used |
|---|---|---|
| `Dashboard.jsx` | Displays stats cards, mismatch alerts, empty unit alerts | `stats`, `products`, `transactions` |
| `Inventory.jsx` | Product CRUD, search, stock transactions | `products`, `addProduct`, `updateProduct`, `fetchProducts`, `addTransaction` |
| `Suppliers.jsx` | Supplier CRUD | `suppliers`, `addSupplier`, `updateSupplier` |
| `Transactions.jsx` | Transaction history with tab filters | `transactions`, `products` |
| `Reports.jsx` | Report generation and PDF/Excel export | `products`, `transactions` |
| `Login.jsx` | Authentication form | `login` from `useAuth()` |

### 5.2 Components (Presentational)

| Component | Props | Description |
|---|---|---|
| `PageHeader` | `title`, `description`, `icon`, `actionButton` | Reusable page header with optional CTA button |
| `ProductTable` | `products`, `handleOpenProductModal`, `handleOpenTransactionModal` | Renders product listing with action buttons |
| `ProductModal` | `open`, `onClose`, `selectedProduct`, `productForm`, `setProductForm`, `handleSaveProduct` | Form dialog for add/edit product. Reads `categories` and `suppliers` from Zustand store. |
| `TransactionModal` | `open`, `onClose`, `transactionType`, `selectedProduct`, `transactionForm`, `setTransactionForm`, `handleSaveTransaction` | Form dialog for stock in/out |
| `SupplierTable` | Supplier listing | Renders supplier records |
| `SupplierModal` | Supplier add/edit form | Form dialog for suppliers |
| `TransactionTable` | Transaction listing | Renders transaction history |

---

## 6. Routing

Defined in `App.jsx` using React Router v6:

| Path | Component | Auth Required |
|---|---|---|
| `/login` | `Login` | No |
| `/dashboard` | `Dashboard` | Yes |
| `/inventory` | `Inventory` | Yes |
| `/suppliers` | `Suppliers` | Yes |
| `/transactions` | `Transactions` | Yes |
| `/reports` | `Reports` | Yes |
| `/` | Redirects to `/dashboard` | Yes |

All authenticated routes are wrapped inside a `Layout` component (sidebar + main content area).

---

## 7. Theme & Styling

Configured in `theme/index.js` using MUI's `createTheme`:

| Token | Value | Purpose |
|---|---|---|
| Primary | `#4f46e5` (Indigo) | Buttons, active states, accents |
| Secondary | `#ec4899` (Pink) | Secondary accents |
| Success | `#10b981` (Emerald) | Positive indicators |
| Warning | `#f59e0b` (Amber) | Mismatch alerts |
| Error | `#ef4444` (Red) | Empty unit alerts |
| Background | `#f8fafc` | Page background |
| Font | Inter | Primary typeface |
| Border Radius | `16px` (global), `10px` (buttons), `12px` (inputs) | Modern rounded corners |

Custom component overrides include hover animations on cards (`translateY(-4px)`) and buttons (`translateY(-1px)`) with colored box shadows.

---

## 8. API Endpoints Summary

All endpoints are relative to the base URL: `http://localhost:8080/api/v1`

| Method | Endpoint | Service | Used By |
|---|---|---|---|
| `GET` | `/products/getAllProducts` | `productService` | `InventoryContext.fetchProducts()` |
| `POST` | `/products/addProduct` | `productService` | `InventoryContext.addProduct()` |
| `GET` | `/categories/getAllCategories` | `categoryService` | `InventoryContext.fetchCategories()` |

---

## 9. Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |

---

## 10. Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).
