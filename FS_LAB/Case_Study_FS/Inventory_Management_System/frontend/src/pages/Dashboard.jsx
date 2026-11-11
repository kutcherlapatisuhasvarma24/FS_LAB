import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import StatCard from '../components/StatCard'
import { CategoryBarChart, CategoryPieChart } from '../components/Charts'
import {
  getInventoryAnalytics,
  getCategoryAnalytics,
  getLowStockProducts
} from '../api/productApi'

const formatINR = (val) => {
  const num = Number(val) || 0
  return `₹${num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    totalValue: 0,
    avgPrice: 0,
    totalCategories: 0
  })
  const [categoryData, setCategoryData] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [invRes, catRes, lowRes] = await Promise.all([
        getInventoryAnalytics().catch((err) => {
          console.warn('Inventory analytics fetch error:', err)
          return null
        }),
        getCategoryAnalytics().catch((err) => {
          console.warn('Category analytics fetch error:', err)
          return []
        }),
        getLowStockProducts(5).catch((err) => {
          console.warn('Low stock fetch error:', err)
          return { data: [] }
        })
      ])

      if (invRes) {
        setInventoryStats({
          totalProducts: invRes.totalProducts || 0,
          totalQuantity: invRes.totalQuantity || 0,
          totalValue: invRes.totalValue || 0,
          avgPrice: invRes.avgPrice || 0,
          totalCategories: invRes.totalCategories || invRes.uniqueCategories || 0
        })
      }

      // Format category analytics
      const catArray = Array.isArray(catRes) ? catRes : catRes?.data || []
      setCategoryData(catArray)

      // If categories count wasn't in inventory summary, derive from categoryData
      if (!invRes?.totalCategories && catArray.length > 0) {
        setInventoryStats((prev) => ({
          ...prev,
          totalCategories: catArray.length
        }))
      }

      // Format low stock
      const lowArray = Array.isArray(lowRes) ? lowRes : lowRes?.data || []
      setLowStockItems(lowArray)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
      toast.error('Unable to fetch some dashboard data. Check backend connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="content-area">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading inventory metrics and analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="content-area">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <span>Dashboard Overview</span>
          </h1>
          <p className="subtitle">
            Real-time stock valuation, category distribution, and inventory metrics
          </p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchDashboardData}
            title="Refresh metrics"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
          <Link to="/products/add" className="btn btn-primary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      {/* 5 StatCards */}
      <div className="stats-grid">
        {/* Total Products */}
        <StatCard
          label="Total Products"
          value={inventoryStats.totalProducts}
          color="primary"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          }
        />

        {/* Total Quantity */}
        <StatCard
          label="Total Units"
          value={inventoryStats.totalQuantity}
          color="info"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          }
        />

        {/* Total Inventory Value (₹) */}
        <StatCard
          label="Inventory Value"
          value={inventoryStats.totalValue}
          prefix="₹"
          color="success"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />

        {/* Categories */}
        <StatCard
          label="Categories"
          value={inventoryStats.totalCategories}
          color="warning"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          }
        />

        {/* Low Stock Items */}
        <StatCard
          label="Low Stock Items"
          value={lowStockItems.length}
          color={lowStockItems.length > 0 ? 'danger' : 'success'}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
        />
      </div>

      {/* Warning Alert if Low Stock Items Exist */}
      {lowStockItems.length > 0 && (
        <div className="alert alert-warning">
          <div className="alert-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="alert-content">
            <div className="alert-title">Low Stock Alert!</div>
            <p>
              There are <strong>{lowStockItems.length}</strong> product(s) with quantity at or below 5 units. Please reorder to prevent stockouts.
            </p>
          </div>
          <Link to="/products" className="btn btn-sm btn-secondary">
            View All
          </Link>
        </div>
      )}

      {/* Low Stock List Card (when items exist) */}
      {lowStockItems.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <h2 className="card-title">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--danger)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Immediate Attention Needed: Low Stock Items
              </h2>
              <span className="card-subtitle">Products with 5 or fewer units remaining in warehouse</span>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              Manage Products
            </Link>
          </div>
          <div className="card-body">
            <div className="low-stock-list">
              {lowStockItems.map((item) => (
                <div key={item._id} className="low-stock-item">
                  <div className="low-stock-info">
                    <span className="low-stock-name">{item.productName}</span>
                    <span className="low-stock-category">{item.category}</span>
                  </div>
                  <div className="low-stock-qty">
                    <span className="badge badge-danger">
                      <span className="badge-dot"></span>
                      {item.quantity} units left
                    </span>
                    <Link
                      to={`/products/edit/${item._id}`}
                      className="btn btn-sm btn-secondary"
                      style={{ marginLeft: '0.75rem' }}
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid: Bar Chart & Pie Chart side by side */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="card-header">
            <div className="card-header-left">
              <h2 className="card-title">Products by Category</h2>
              <span className="card-subtitle">Quantity of unique SKUs per product family</span>
            </div>
          </div>
          <CategoryBarChart data={categoryData} />
        </div>

        <div className="chart-card">
          <div className="card-header">
            <div className="card-header-left">
              <h2 className="card-title">Valuation by Category</h2>
              <span className="card-subtitle">Monetary distribution across inventory</span>
            </div>
          </div>
          <CategoryPieChart data={categoryData} />
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <h2 className="card-title">Category Breakdown</h2>
            <span className="card-subtitle">Detailed aggregates computed via MongoDB pipeline</span>
          </div>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Products</th>
                <th style={{ textAlign: 'center' }}>Total Quantity</th>
                <th style={{ textAlign: 'right' }}>Inventory Value</th>
                <th style={{ textAlign: 'right' }}>Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No category breakdown data available yet.
                  </td>
                </tr>
              ) : (
                categoryData.map((cat, idx) => (
                  <tr key={cat.category || idx}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {cat.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-primary">{cat.count || 0}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: 500 }}>
                        {(cat.totalQuantity || 0).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--success)' }}>
                      {formatINR(cat.totalValue)}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {formatINR(cat.avgPrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
