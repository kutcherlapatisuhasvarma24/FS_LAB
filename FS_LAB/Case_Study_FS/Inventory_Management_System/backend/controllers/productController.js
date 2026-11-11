const Product = require('../models/Product');

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public
 */
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'SKU already exists',
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all products with filtering, search, sorting and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    // Search by product name or SKU using regex
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ productName: searchRegex }, { sku: searchRegex }];
    }

    // Category filter
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      query.category = category.trim();
    }

    // Sorting
    const validSortFields = ['price', 'quantity', 'productName', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    let sortDirection = -1;
    if (sortOrder === 'asc' || sortOrder === '1' || sortOrder === 1) {
      sortDirection = 1;
    } else if (sortOrder === 'desc' || sortOrder === '-1' || sortOrder === -1) {
      sortDirection = -1;
    }

    const sortOptions = {};
    sortOptions[sortField] = sortDirection;

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const data = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: data.length,
      total,
      page: pageNum,
      pages,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Public
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'SKU already exists',
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Public
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Category-wise analytics aggregation
 * @route   GET /api/products/analytics/category
 * @access  Public
 */
const getCategoryAnalytics = async (req, res, next) => {
  try {
    const analytics = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          category: { $first: '$category' },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: {
            $sum: { $multiply: ['$price', '$quantity'] },
          },
          avgPrice: { $avg: '$price' },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
          totalQuantity: 1,
          totalValue: { $round: ['$totalValue', 2] },
          avgPrice: { $round: ['$avgPrice', 2] },
        },
      },
    ]);

    return res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Overall inventory analytics summary & category count
 * @route   GET /api/products/analytics/inventory
 * @access  Public
 */
const getInventoryAnalytics = async (req, res, next) => {
  try {
    // Aggregation 1: Overall summary with totalProducts, totalQuantity, totalValue, avgPrice
    const summaryAggregation = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: {
            $sum: { $multiply: ['$price', '$quantity'] },
          },
          avgPrice: { $avg: '$price' },
        },
      },
    ]);

    // Aggregation 2: Count of unique categories
    const categoryCountAggregation = await Product.aggregate([
      {
        $group: {
          _id: '$category',
        },
      },
      {
        $count: 'totalCategories',
      },
    ]);

    const summary = summaryAggregation[0] || {
      totalProducts: 0,
      totalQuantity: 0,
      totalValue: 0,
      avgPrice: 0,
    };

    const uniqueCategoriesCount = categoryCountAggregation[0]
      ? categoryCountAggregation[0].totalCategories
      : 0;

    // Merged object response
    const merged = {
      success: true,
      totalProducts: summary.totalProducts || 0,
      totalQuantity: summary.totalQuantity || 0,
      totalValue: summary.totalValue ? Math.round(summary.totalValue * 100) / 100 : 0,
      avgPrice: summary.avgPrice ? Math.round(summary.avgPrice * 100) / 100 : 0,
      totalCategories: uniqueCategoriesCount,
      uniqueCategories: uniqueCategoriesCount,
    };

    return res.status(200).json(merged);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get low stock products matching threshold
 * @route   GET /api/products/analytics/low-stock
 * @access  Public
 */
const getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold, 10) || 5;

    const data = await Product.aggregate([
      {
        $match: {
          quantity: { $lte: threshold },
        },
      },
      {
        $sort: {
          quantity: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      threshold,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategoryAnalytics,
  getInventoryAnalytics,
  getLowStockProducts,
};
