const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // URL to the specific variant image
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
  description: {
    type: String,
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
