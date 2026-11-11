import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Centralized response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred'
    if (error.response) {
      errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        `Request failed with status ${error.response.status}`
    } else if (error.request) {
      errorMessage = 'No response received from server. Please check your backend connection.'
    } else {
      errorMessage = error.message
    }
    return Promise.reject(new Error(errorMessage))
  }
)

/**
 * Fetch all products with optional filters, search, sorting and pagination
 * @param {Object} params - { search, category, sortBy, sortOrder, page, limit }
 */
export const getAllProducts = async (params = {}) => {
  const response = await api.get('/products', { params })
  return response.data
}

/**
 * Fetch a single product by its MongoDB ObjectId
 * @param {string} id
 */
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

/**
 * Create a new product
 * @param {Object} data - Product details
 */
export const createProduct = async (data) => {
  const response = await api.post('/products', data)
  return response.data
}

/**
 * Update an existing product
 * @param {string} id - Product ObjectId
 * @param {Object} data - Updated product fields
 */
export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data)
  return response.data
}

/**
 * Delete a product by its ID
 * @param {string} id
 */
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

/**
 * Fetch category-wise aggregation analytics (count, totalQuantity, totalValue, avgPrice)
 */
export const getCategoryAnalytics = async () => {
  const response = await api.get('/products/analytics/category')
  return response.data
}

/**
 * Fetch overall inventory valuation summary & unique category counts
 */
export const getInventoryAnalytics = async () => {
  const response = await api.get('/products/analytics/inventory')
  return response.data
}

/**
 * Fetch products with quantity lower than or equal to threshold
 * @param {number} threshold - Stock limit (default 5)
 */
export const getLowStockProducts = async (threshold = 5) => {
  const response = await api.get('/products/analytics/low-stock', {
    params: { threshold }
  })
  return response.data
}

export default api
