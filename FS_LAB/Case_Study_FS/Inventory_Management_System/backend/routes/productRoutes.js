const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategoryAnalytics,
  getInventoryAnalytics,
  getLowStockProducts,
} = require('../controllers/productController');

// Analytics routes - MUST be placed before /:id parameterized routes
router.get('/analytics/category', getCategoryAnalytics);
router.get('/analytics/inventory', getInventoryAnalytics);
router.get('/analytics/low-stock', getLowStockProducts);

// Collection routes
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

// Individual product document routes
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
