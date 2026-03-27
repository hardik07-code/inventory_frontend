# StockUI - Minimalist Inventory Management Frontend

**StockUI** is a lightweight, clean, and highly responsive frontend application designed specifically for small retail shops to track their stock accurately, reduce manual accounting errors, and generate beautiful data reports in seconds.

---

## 🚀 Features

### 1. Secure Authentication Layer
- **Protected Routes:** Requires users to log in before viewing sensitive inventory data.
- **Session Persistence:** Automatically remembers active sessions using local storage so you don't lose your place.
- *Note: Login currently accepts any email/password combination for demonstration purposes.*

### 2. Comprehensive Dashboard
- **Real-time Metrics:** Top-level cards displaying Total Products, Low Stock count, and Out of Stock limits directly pulled dynamically from the inventory.
- **Visual Alerts:** Dedicated panels instantly flag which specific SKUs are low or fully depleted.

### 3. Inventory Management (Products)
- **Data Table:** A searchable and filterable ledger containing all inventory.
- **Quick Status Chips:** Visual tags (In Stock, Low Stock, Out of Stock) making it incredibly easy to see stock health.
- **Stock Movement Actions:** Dedicated "Stock In" (Restock) and "Stock Out" (Sale) buttons directly on the table, automatically prompting the user for quantities and notes rather than allowing manual, silent edits.
- **Categorization:** Pre-defined dropdowns for product categories (Groceries, Electronics, Bakery, etc.) to ensure consistency.

### 4. Transactions Ledger
- **Automatic History:** Every time a product is added, reduced, or edited, an immutable timestamped log is recorded here.
- **Sale vs Shrinkage:** Logs track whether a specific movement was an inward delivery or an outward sale/adjustment.

### 5. Advanced Reporting & Export
- **Dynamic Time Filters:** Instantly aggregate and calculate your total inward/outward inventory movements for "Today", "This Week", "This Month", "Last 6 Months", "This Year", or an exact "Custom Range".
- **Product Filters:** Look at total store metrics or drill down into one specific product's performance.
- **Instant Exporting:** Native buttons to instantly download the generated report as an Excel spreadsheet (`.xlsx`) or a beautifully formatted PDF document.

---

## 🛠 Tech Stack

- **Framework:** React 18 (via Vite)
- **UI & Components:** Material UI (MUI v5)
- **Icons:** `lucide-react`
- **Routing:** React Router DOM (v6)
- **Reporting / Export Tools:** 
    - `xlsx` (Excel generation)
    - `jspdf` & `jspdf-autotable` (PDF generation)
    - `date-fns` (time calculations)
- **State Management:** React Context API (`AuthContext` & `InventoryContext`)

---

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI parts
│   ├── Layout.jsx       # The main wrapper bridging Sidebar & Page Content
│   └── Sidebar.jsx      # Navigation sidebar (responsive)
├── pages/               # Main Application Views
│   ├── Dashboard.jsx    # Metrics and Alerts overview
│   ├── Inventory.jsx    # Product list, add/edit form, stock actions
│   ├── Login.jsx        # Attractive login portal
│   ├── Reports.jsx      # Aggregation logic and Export functions
│   └── Transactions.jsx # Ledger history
├── store/               # Global State (Context)
│   ├── AuthContext.jsx  # Manages credentials and protected logic
│   └── InventoryContext.jsx # Manages fake DB, stock math, and transactions
├── theme/               # Visual styling configuration
│   └── index.js         # MUI Theme (Indigo aesthetics, soft shadows)
├── App.jsx              # Main Router and Protected Route declarations
└── main.jsx             # App initialization wrapper
```

---

## 💻 Getting Started (Local Development)

### 1. Install Dependencies
Make sure you have Node installed. Open the project folder in your terminal and run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`. You will instantly be redirected to the `/login` screen. Enter any test email and password to begin using the system.

---

## ⚠️ Current Architecture Notes & Limitations

Because this is a purely **Frontend MVP (Minimum Viable Product)**, there are a few architectural decisions to take note of before attempting to push to production:

1. **In-Memory Volatile Storage**: Currently, the `InventoryContext` relies on React State. Data changes (like adding a product) will disappear if you completely refresh the page.
    - *Next Steps:* Connect the Context functions directly to a real backend Database (PostgreSQL, MongoDB) or to browser `localStorage` to save changes permanently.
2. **Barcode Scanning**: It is currently designed to be compatible with physical USB barcode scanners. Users can focus the search bar or product SKU input and physically scan a barcode—which acts as rapid keyboard input.
3. **Edge Case Logging**: If a user enters a negative number into the Stock form, or inputs duplicate SKUs, the frontend will accept it. In the future, these fields should be strictly validated by a backend server to prevent logic breaks.
