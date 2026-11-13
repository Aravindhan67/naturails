const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: [
        'Skincare',
        'Haircare',
        'Essential Oils',
        'Wellness & Teas',
        'Handmade Soaps',
        'Body Care',
      ],
      default: 'Skincare',
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
    },
    ingredients: {
      type: String,
      default: '100% pure botanical extracts and wild-harvested herbs',
    },
    benefits: [
      {
        type: String,
      },
    ],
    certifications: [
      {
        type: String,
      },
    ],
    volumeOrWeight: {
      type: String,
      default: '100 ml',
    },
    // The image is stored directly in database as Base64 Data URL or SVG string
    image: {
      type: String,
      required: [true, 'Product image is required in database'],
    },
    stock: {
      type: Number,
      required: true,
      default: 25,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    numReviews: {
      type: Number,
      default: 12,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
