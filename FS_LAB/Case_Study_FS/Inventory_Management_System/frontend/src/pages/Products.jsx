import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'
import { getAllProducts, deleteProduct } from '../api/productApi'

const PRESET_CATEGORIES = [
  'All Categories',
  'Electronics',
  'Apparel',
  'Groceries',
  'Furniture',
  'Books',
  'Stationery',
  'Health & Beauty',
  'Automotive',
  'Sports'
]

const formatINR = (val) => {
  const num = Number(val) || 0
  return `₹${num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`
}

const Products = () => {
  // State
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null
  })

  // Debounced search (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  // Fetch products when filters/search/sort change
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        search: debouncedSearch.trim() || undefined,
        category: category !== 'All Categories' ? category : undefined,
        sortBy,
        sortOrder,
        limit: 100
      }

      const res = await getAllProducts(params)
      const list = Array.isArray(res) ? res : res.data || []
      setProducts(list)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error(error.message || 'Error loading products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [debouncedSearch, category, sortBy, sortOrder])

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteModal.product) return
    const { _id, productName } = deleteModal.product

    try {
      await deleteProduct(_id)
      toast.success(`"${productName}" deleted successfully!`)
      // Refresh list
      fetchProducts()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error(error.message || 'Failed to delete product')
    } finally {
      setDeleteModal({ isOpen: false, product: null })
    }
  }

  // Helper to generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'PR'
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1>Product Catalog</h1>
          <p className="subtitle">
            Manage inventory items, stock levels, suppliers, and pricing
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/products/add" className="btn btn-primary">
            <svg
              width="18"
              height="18"
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

      {/* Search & Filter Bar */}
      <div className="filters-bar">
        {/* Search Input with 400ms debounce */}
        <div className="search-bar">
          <div className="search-bar-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters and Sorting */}
        <div className="filter-controls">
          {/* Category Filter */}
          <select
            className="form-control filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {PRESET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort By Field */}
          <select
            className="form-control filter-select"
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split(':')
              setSortBy(field)
              setSortOrder(order)
            }}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="quantity:asc">Quantity: Low to High</option>
            <option value="quantity:desc">Quantity: High to Low</option>
            <option value="productName:asc">Name: A to Z</option>
            <option value="productName:desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Main Products Table Card */}
      <div className="card">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Fetching inventory records...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
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
            </div>
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-desc">
              {search || category !== 'All Categories'
                ? 'Try adjusting your search criteria or clear current filters.'
                : 'Your inventory is currently empty. Get started by adding your first product.'}
            </p>
            {search || category !== 'All Categories' ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearch('')
                  setCategory('All Categories')
                }}
              >
                Clear Filters
              </button>
            ) : (
              <Link to="/products/add" className="btn btn-primary">
                Add New Product
              </Link>
            )}
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Product Name & SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Supplier</th>
                  <th style={{ textAlign: 'center', width: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => {
                  const isLowStock = item.quantity < 5
                  return (
                    <tr key={item._id || index}>
                      <td style={{ color: 'var(--text-muted)' }}>{index + 1}</td>
                      <td>
                        <div className="product-cell">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="product-avatar"
                              onError={(e) => {
                                // Fallback to initial div on image load error
                                e.currentTarget.style.display = 'none'
                                if (e.currentTarget.nextSibling) {
                                  e.currentTarget.nextSibling.style.display = 'flex'
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className="product-initials"
                            style={{
                              display: item.imageUrl ? 'none' : 'flex'
                            }}
                          >
                            {getInitials(item.productName)}
                          </div>
                          <div className="product-info-text">
                            <span className="product-name">{item.productName}</span>
                            <span className="product-sku">SKU: {item.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-secondary">{item.category}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatINR(item.price)}
                      </td>
                      <td>
                        {isLowStock ? (
                          <span className="badge badge-danger">
                            <span className="badge-dot"></span>
                            {item.quantity} Low Stock
                          </span>
                        ) : (
                          <span className="badge badge-success">
                            <span className="badge-dot"></span>
                            {item.quantity} In Stock
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {item.supplierName || '—'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <Link
                            to={`/products/edit/${item._id}`}
                            className="btn btn-outline btn-sm btn-icon"
                            title="Edit product"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm btn-icon"
                            title="Delete product"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                product: item
                              })
                            }
                            style={{
                              borderColor: 'rgba(239, 68, 68, 0.4)',
                              color: 'var(--danger)'
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deleteModal.product?.productName}" (SKU: ${deleteModal.product?.sku})? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default Products
