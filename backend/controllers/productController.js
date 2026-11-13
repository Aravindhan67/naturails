const dbStore = require('../data/dbStore');
const Product = require('../models/Product');
const { generateProductSvg } = require('../data/seedData');

// @desc    Fetch all products with filtering & search
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, featured, bestSeller } = req.query;

    if (dbStore.isMongoose) {
      let query = {};

      if (category && category !== 'All') {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { ingredients: { $regex: search, $options: 'i' } },
        ];
      }

      if (featured === 'true') {
        query.isFeatured = true;
      }

      if (bestSeller === 'true') {
        query.bestSeller = true;
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price-low') sortOptions = { price: 1 };
      if (sort === 'price-high') sortOptions = { price: -1 };
      if (sort === 'rating') sortOptions = { rating: -1 };
      if (sort === 'name') sortOptions = { name: 1 };

      const products = await Product.find(query).sort(sortOptions);
      return res.json(products);
    } else {
      let list = [...dbStore.memoryData.products];

      if (category && category !== 'All') {
        list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            (p.ingredients && p.ingredients.toLowerCase().includes(s))
        );
      }

      if (featured === 'true') {
        list = list.filter((p) => p.isFeatured);
      }

      if (bestSeller === 'true') {
        list = list.filter((p) => p.bestSeller);
      }

      if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
      else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
      else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json(list);
    }
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (dbStore.isMongoose) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    } else {
      const product = dbStore.memoryData.products.find((p) => p._id === id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product' });
  }
};

// @desc    Create a product (Admin) - Stores image in database
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      description,
      ingredients,
      benefits,
      certifications,
      volumeOrWeight,
      image,
      stock,
      isFeatured,
      bestSeller,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    // Default image if none provided: generate a custom vector SVG Data URL stored directly in database
    const finalImage =
      image && image.trim() !== ''
        ? image
        : generateProductSvg(name, category, '#2D5A27', '#46783F', '#C27351', 'leaf');

    const productPayload = {
      name,
      category: category || 'Skincare',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.2,
      description: description || 'Pure handcrafted botanical formula.',
      ingredients: ingredients || '100% natural botanical oils and herbal extracts',
      benefits: Array.isArray(benefits)
        ? benefits
        : typeof benefits === 'string'
        ? benefits.split(',').map((b) => b.trim())
        : ['100% Pure Botanical Formula'],
      certifications: Array.isArray(certifications)
        ? certifications
        : typeof certifications === 'string'
        ? certifications.split(',').map((c) => c.trim())
        : ['100% Organic', 'Cruelty Free'],
      volumeOrWeight: volumeOrWeight || '100 ml',
      image: finalImage,
      stock: stock !== undefined ? Number(stock) : 25,
      rating: 5.0,
      numReviews: 1,
      isFeatured: Boolean(isFeatured),
      bestSeller: Boolean(bestSeller),
    };

    if (dbStore.isMongoose) {
      const created = await Product.create(productPayload);
      return res.status(201).json(created);
    } else {
      const newProduct = {
        _id: `prod_nat_${Date.now()}`,
        ...productPayload,
        createdAt: new Date().toISOString(),
      };
      dbStore.memoryData.products.unshift(newProduct);
      dbStore.save();
      return res.status(201).json(newProduct);
    }
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: error.message || 'Error creating product' });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (dbStore.isMongoose) {
      const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(updated);
    } else {
      const idx = dbStore.memoryData.products.findIndex((p) => p._id === id);
      if (idx === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }
      dbStore.memoryData.products[idx] = {
        ...dbStore.memoryData.products[idx],
        ...updateData,
      };
      dbStore.save();
      return res.json(dbStore.memoryData.products[idx]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (dbStore.isMongoose) {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json({ message: 'Product deleted successfully', id });
    } else {
      const idx = dbStore.memoryData.products.findIndex((p) => p._id === id);
      if (idx === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }
      dbStore.memoryData.products.splice(idx, 1);
      dbStore.save();
      return res.json({ message: 'Product deleted successfully', id });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
