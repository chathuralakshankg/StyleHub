const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, category, subCategory, fabric, price, variants } = req.body;
    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      name,
      category,
      subCategory,
      fabric,
      price: Number(price),
      variants: parsedVariants,
      images,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, category, subCategory, fabric, price, variants, existingImages } = req.body;
    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.category = category || product.category;
      product.subCategory = subCategory !== undefined ? subCategory : product.subCategory;
      product.fabric = fabric || product.fabric;
      if (price) product.price = Number(price);
      if (variants) product.variants = parsedVariants;

      let parsedExistingImages = [];
      if (existingImages) {
          parsedExistingImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      }

      let newImages = req.files ? req.files.map(file => file.path) : [];
      
      // Combine kept existing images with newly uploaded images
      product.images = [...parsedExistingImages, ...newImages];

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
