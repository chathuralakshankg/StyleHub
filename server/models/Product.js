const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: {
    type: String,
    required: true,
    trim: true,
  },
  fabric: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [{
    type: String, // URLs to the images
  }],
  variants: [variantSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
