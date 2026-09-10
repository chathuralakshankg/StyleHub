const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

const upload = multer({ storage });

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin', 'developer'), upload.any(), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('admin', 'developer'), upload.any(), updateProduct)
  .delete(protect, authorize('admin', 'developer'), deleteProduct);

module.exports = router;
