# Inventory UI - Frontend Documentation

This document explains the architecture, directory structure, state management, and design patterns used in the React frontend of the Inventory Management System.

## Project Overview
The application is a React-based single-page application (SPA) built to manage product units, suppliers, and stock transactions. It uses Material-UI (MUI) for a robust, premium UI and React Context for state management.

## Directory Structure
The `src` directory has been organized into a scalable component-based architecture:

```text
src/
├── components/          # Reusable UI components
│   ├── common/          # Shared components across multiple pages
│   │   └── PageHeader.jsx
│   ├── inventory/       # Components specific to the Inventory page
│   │   ├── ProductTable.jsx
│   │   ├── ProductModal.jsx
│   │   └── TransactionModal.jsx
│   ├── suppliers/       # Components specific to the Suppliers page
│   │   ├── SupplierTable.jsx
│   │   └── SupplierModal.jsx
│   └── transactions/    # Components specific to the Transactions logs
│       └── TransactionTable.jsx
├── pages/               # Main route views/pages
│   ├── Dashboard.jsx
│   ├── Inventory.jsx
│   ├── Suppliers.jsx
│   └── Transactions.jsx
├── store/               # Global state management
│   ├── AuthContext.jsx
│   └── InventoryContext.jsx
├── theme/               # MUI Theme configuration
├── App.jsx              # Main application router and context provider wrap
├── main.jsx             # React entry point
└── index.css            # Global CSS styles
```

## Component Architecture
The frontend has been refactored to extract complex UI logic away from the main `pages` into modular `components`:

### `pages/`
Pages operate mainly as containers or orchestrators. They:
1. Fetch or subscribe to global state (`useInventory()`).
2. Manage local page state like `searchTerm`, tabs, or modal visibility triggers.
3. Pass data down to functional components as props.

### `components/`
- **`common/PageHeader.jsx`**: A reusable header providing consistent title, description, and primary call-to-action buttons across the layout.
- **Entity Modals**: Data entry forms inside MUI Dialogs (`ProductModal`, `SupplierModal`, `TransactionModal`). Taking these out of the page root makes the pages considerably easier to read.
- **Entity Tables**: Data grids rendering listings (`ProductTable`, `SupplierTable`, `TransactionTable`).

## State Management & API Integration
State is managed globally using **React Context API**, combined with modular API services.
- **`InventoryContext.jsx`**: Provides central access to arrays like `products`, `suppliers`, and `transactions` as well as actions (`addProduct`, `updateSupplier`, `addTransaction`). It coordinates with `productService.js` to perform backend actions and update global state upon success.
- **`AuthContext.jsx`**: Handles authentication state (e.g., `user`).
- **`services/` (API Layer)**: Encapsulates API interactions to keep components clean.
  - `api.js`: Handles global Axios configuration, base URLs, and interceptors for token attachment and overall error handling.
  - `productService.js`: Defines methods like `getAllProducts` and `addProduct`, mapping backend Data Transfer Objects (DTOs) to frontend models.

Components tap into this state using custom hooks, primarily `const { ... } = useInventory();`.

## Styling
- **Material-UI (MUI)**: Extensively used for predefined UI elements (Buttons, Tables, Dialogs, TextFields). The `sx` prop is heavily utilized for inline styling and responsive design.
- **Lucide-React**: Used for consistent, lightweight SVG icons.
- **Custom Theme**: The overall aesthetic is customized using the files inside `src/theme/`.

## Key User Flows
1. **Inventory Management**: View products. Click "Add Product" to open the `ProductModal`. Click "Stock In/Out" arrows to open the `TransactionModal`.
2. **Supplier Management**: Register or edit agency names and contact records via `SupplierModal`.
3. **Transaction Logs**: View real-time history of "Stock In" and "Stock Out" events filtered using tabs.

## Running the Application
Ensure dependencies are installed and run the Vite development server:
```bash
npm install
npm run dev
```
