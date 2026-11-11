import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getProductById, updateProduct } from '../api/productApi'

const CATEGORIES = [
  'Electronics',
  'Apparel',
  'Groceries',
  'Furniture',
  'Books',
  'Stationery',
  'Health & Beauty',
  'Automotive',
  'Sports',
  'Other'
]

const initialFormData = {
  productName: '',
  sku: '',
  category: '',
  price: '',
  quantity: '',
  supplierName: '',
  imageUrl: '',
  description: ''
}

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(initialFormData)
  const [initialLoading, setInitialLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [notFound, setNotFound] = useState(false)

  // Fetch product by ID on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setInitialLoading(true)
        const res = await getProductById(id)
        const product = res.data || res

        if (!product) {
          setNotFound(true)
          return
        }

        setFormData({
          productName: product.productName || '',
          sku: product.sku || '',
          category: product.category || '',
          price: product.price !== undefined ? product.price.toString() : '',
          quantity: product.quantity !== undefined ? product.quantity.toString() : '',
          supplierName: product.supplierName || '',
          imageUrl: product.imageUrl || '',
          description: product.description || ''
        })
      } catch (error) {
        console.error('Fetch product for edit failed:', error)
        toast.error('Unable to locate the specified product.')
        setNotFound(true)
      } finally {
        setInitialLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  // Field change handler
  const handleChange = (e) => {
    let { name, value } = e.target

    if (name === 'sku') {
      value = value.toUpperCase()
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }))
    }
  }

  // Client validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required.'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU code is required.'
    } else if (!/^[A-Z0-9_-]+$/.test(formData.sku.trim())) {
      newErrors.sku = 'SKU should only contain alphanumeric characters, hyphens or underscores.'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Please select a category.'
    }

    if (formData.price === '' || formData.price === null) {
      newErrors.price = 'Price is required.'
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a valid number greater than or equal to 0.'
    }

    if (formData.quantity === '' || formData.quantity === null) {
      newErrors.quantity = 'Quantity is required.'
    } else {
      const qtyNum = Number(formData.quantity)
      if (isNaN(qtyNum) || !Number.isInteger(qtyNum) || qtyNum < 0) {
        newErrors.quantity = 'Quantity must be a non-negative integer (e.g. 0, 1, 2...).'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please resolve the errors highlighted below.')
      return
    }

    try {
      setSaving(true)

      const payload = {
        productName: formData.productName.trim(),
        sku: formData.sku.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        supplierName: formData.supplierName.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        description: formData.description.trim() || undefined
      }

      await updateProduct(id, payload)
      toast.success('Product updated successfully!')
      navigate('/products')
    } catch (error) {
      console.error('Update product error:', error)
      const msg = error.message || 'Failed to update product'
      toast.error(msg)
      if (msg.toLowerCase().includes('sku')) {
        setErrors((prev) => ({
          ...prev,
          sku: 'This SKU is already in use by another product.'
        }))
      }
    } finally {
      setSaving(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="content-area">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading product information...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="content-area">
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="empty-state-title">Product Not Found</h3>
          <p className="empty-state-desc">
            The requested product could not be located in the inventory database. It may have been removed.
          </p>
          <Link to="/products" className="btn btn-primary">
            Back to Products Catalog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1>Update Product</h1>
          <p className="subtitle">
            Modify details, pricing, and current inventory stock for SKU: {formData.sku}
          </p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          {/* Row 1: Product Name & SKU */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productName" className="form-label">
                Product Name <span className="required">*</span>
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
                value={formData.productName}
                onChange={handleChange}
              />
              {errors.productName && (
                <div className="form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.productName}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sku" className="form-label">
                SKU (Stock Keeping Unit) <span className="required">*</span>
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                value={formData.sku}
                onChange={handleChange}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.sku && (
                <div className="form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.sku}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Category & Supplier Name */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.category}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="supplierName" className="form-label">
                Supplier Name
              </label>
              <input
                id="supplierName"
                name="supplierName"
                type="text"
                className="form-control"
                value={formData.supplierName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 3: Price & Quantity */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Unit Price (₹ INR) <span className="required">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && (
                <div className="form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.price}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                Stock Quantity <span className="required">*</span>
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                step="1"
                min="0"
                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                value={formData.quantity}
                onChange={handleChange}
              />
              {errors.quantity && (
                <div className="form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.quantity}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Image URL */}
          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">
              Product Image URL
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              className="form-control"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          {/* Row 5: Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/products')}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner spinner-sm"></div>
                  Updating Product...
                </>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
