# InvenTrack — Inventory Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) Inventory Management System with real-time analytics, CRUD operations, and cloud deployment support.

---

## 🚀 Features

- **Dashboard Analytics** — Total products, quantities, inventory value, category distribution
- **Product CRUD** — Add, view, edit, delete products with full validation
- **Search & Filter** — Search by name/SKU, filter by category, sort by price/quantity
- **Low Stock Alerts** — Real-time low stock notifications with configurable threshold
- **Charts** — Category-wise bar chart and inventory value doughnut chart
- **Aggregation Pipelines** — MongoDB aggregations for category stats, inventory valuation
- **Indexed Search** — SKU (unique), productName (text), category indexes for performance
- **Cloud Ready** — Configured for MongoDB Atlas, Render (backend), Vercel (frontend)

---

## 📁 Project Structure

```
inventory-management-system/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   └── productController.js  # CRUD + Analytics logic
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized error handling
│   ├── models/
│   │   └── Product.js            # Mongoose schema + indexes
│   ├── routes/
│   │   └── productRoutes.js      # REST API routes
│   ├── server.js                 # Express entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/productApi.js     # Axios service layer
│   │   ├── components/           # Reusable React components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── Charts.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   └── EditProduct.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── screenshots/                  # Application screenshots
├── documentation/
│   ├── generate-report.js        # PDF report generator
│   └── Case_Study_Report.pdf     # Generated academic report
├── README.md
└── .gitignore
```

---

## ⚙️ Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account (free tier is sufficient)

---

## 🛠️ Local Development Setup

### Step 1: Clone / Extract the Project

```bash
cd inventory-management-system
```

### Step 2: Setup Backend

```bash
cd backend
npm install
```

Create `.env` file from the example:
```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB Atlas connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/inventory_management?retryWrites=true&w=majority
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/products` | Create new product |
| GET | `/api/products` | Get all products (with search/filter/sort) |
| GET | `/api/products/:id` | Get single product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/analytics/category` | Category-wise aggregation |
| GET | `/api/products/analytics/inventory` | Inventory valuation summary |
| GET | `/api/products/analytics/low-stock` | Low stock products |

### Query Parameters for GET /api/products

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by name or SKU | `?search=laptop` |
| `category` | string | Filter by category | `?category=Electronics` |
| `sortBy` | string | Sort field | `?sortBy=price` |
| `sortOrder` | string | `asc` or `desc` | `?sortOrder=desc` |
| `page` | number | Page number | `?page=1` |
| `limit` | number | Items per page | `?limit=20` |

---

## 🗃️ MongoDB Database

**Database:** `inventory_management`  
**Collection:** `products`

### Document Structure

```json
{
  "_id": "MongoDB ObjectId",
  "productName": "Laptop Pro 15",
  "sku": "PROD001",
  "category": "Electronics",
  "description": "High-performance business laptop",
  "price": 55000,
  "quantity": 10,
  "supplierName": "ABC Suppliers",
  "imageUrl": "https://example.com/laptop.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Indexes

```javascript
// Unique index on SKU
db.products.createIndex({ sku: 1 }, { unique: true })

// Text index for search
db.products.createIndex({ productName: "text" })

// Category index for filtering
db.products.createIndex({ category: 1 })
```

### Sample Aggregation Queries

```javascript
// Category-wise analytics
db.products.aggregate([
  { $group: {
    _id: '$category',
    count: { $sum: 1 },
    totalQuantity: { $sum: '$quantity' },
    totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
  }},
  { $sort: { count: -1 } }
])

// Inventory summary
db.products.aggregate([
  { $group: {
    _id: null,
    totalProducts: { $sum: 1 },
    totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
  }}
])

// Low stock (quantity <= 5)
db.products.aggregate([
  { $match: { quantity: { $lte: 5 } } },
  { $sort: { quantity: 1 } }
])
```

---

## ☁️ Cloud Deployment

### 1. MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) → Create account
2. Create a free cluster (M0)
3. Under **Database Access** → Add user with read/write permissions
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all, for Render)
5. Under **Connect** → Choose "Connect your application" → Copy connection string
6. Replace `<username>`, `<password>` in connection string

### 2. Backend on Render

1. Go to [Render](https://render.com) → Create account
2. New → **Web Service** → Connect your GitHub repo
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `MONGODB_URI` = your Atlas connection string
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your Vercel URL (add after Vercel deploy)
5. Deploy → Note your backend URL (e.g., `https://inventory-api.onrender.com`)

### 3. Frontend on Vercel

1. Go to [Vercel](https://vercel.com) → Create account
2. Import your GitHub repo
3. Set:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = your Render backend URL + `/api`
     (e.g., `https://inventory-api.onrender.com/api`)
5. Deploy → Your app is live!

---

## 📊 Generating the Academic Report PDF

```bash
cd documentation
npm install pdfkit
node generate-report.js
# Generates Case_Study_Report.pdf
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Dashboard loads with analytics stats
- [ ] Add product form validates required fields
- [ ] Product listing shows all products
- [ ] Search filters products in real-time
- [ ] Category filter works correctly
- [ ] Edit product pre-fills form with existing data
- [ ] Delete product shows confirmation modal
- [ ] Charts render with real data
- [ ] Low stock alert appears when items are below threshold

### API Testing (using curl)

```bash
# Health check
curl http://localhost:5000/api/health

# Create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"productName":"Test Laptop","sku":"PROD001","category":"Electronics","price":50000,"quantity":10,"supplierName":"Test Supplier"}'

# Get all products
curl http://localhost:5000/api/products

# Get analytics
curl http://localhost:5000/api/products/analytics/inventory
curl http://localhost:5000/api/products/analytics/category
curl http://localhost:5000/api/products/analytics/low-stock?threshold=10
```

---

## 📚 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React.js | 18.x |
| Routing | React Router | v6 |
| HTTP Client | Axios | 1.x |
| Charts | Chart.js + react-chartjs-2 | 4.x |
| Notifications | react-hot-toast | 2.x |
| Build Tool | Vite | 5.x |
| Backend | Node.js + Express.js | 18.x / 4.x |
| Database | MongoDB + Mongoose | 8.x |
| Cloud DB | MongoDB Atlas | — |
| Backend Hosting | Render | — |
| Frontend Hosting | Vercel | — |

---

## 📄 License

This project is for academic purposes.

---

## 👨‍💻 Authors

Developed as part of an academic case study on Full Stack Web Development using the MERN Stack.
