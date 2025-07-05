// product.controller.js
// Handles product-related operations for users and admins/sellers

import Product from "#shared/models/Product.js";

// --- User-facing functions ---

// GET /api/products
// Fetches all products with optional filters (category, tags, price range)
export const getAllProducts = async (req, res) => {
  try {
    const { categoryId, tags, minPrice, maxPrice, search } = req.query;
    const query = {};

    if (categoryId) query.categoryIds = categoryId;
    if (tags) query.tagsAndKeywords = { $in: tags.split(",") };
    if (minPrice) query.productPrice = { $gte: parseFloat(minPrice) };
    if (maxPrice)
      query.productPrice = {
        ...query.productPrice,
        $lte: parseFloat(maxPrice),
      };
    if (search) query.productName = { $regex: search, $options: "i" };

    const products = await Product.find(query).populate("categoryIds", "name");
    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/products/:id
// Fetches a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryIds",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/products/search
// Searches products by name or description
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.find({
      $or: [
        { productName: { $regex: query, $options: "i" } },
        { productShortDescription: { $regex: query, $options: "i" } },
        { productLongDescription: { $regex: query, $options: "i" } },
      ],
    }).populate("categoryIds", "name");

    res.status(200).json({
      message: "Search results fetched successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Admin/Seller-facing functions ---

// POST /api/products
// Creates a new product (admin/seller only)
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      productTitle,
      productShortDescription,
      productLongDescription,
      productDetails,
      productImages,
      categoryIds,
      tagsAndKeywords,
      discount,
      couponCodes,
    } = req.body;

    // Check if product name already exists
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name already in use" });
    }

    const product = new Product({
      productName,
      productPrice,
      productTitle,
      productShortDescription,
      productLongDescription,
      productDetails,
      productImages,
      categoryIds,
      tagsAndKeywords,
      discount,
      couponCodes,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/products/:id
// Updates a product by ID (admin/seller only)
export const updateProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      productTitle,
      productShortDescription,
      productLongDescription,
      productDetails,
      productImages,
      categoryIds,
      tagsAndKeywords,
      discount,
      couponCodes,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if new product name is already in use by another product
    if (productName && productName !== product.productName) {
      const existingProduct = await Product.findOne({ productName });
      if (existingProduct) {
        return res.status(400).json({ message: "Product name already in use" });
      }
    }

    // Update fields
    product.productName = productName || product.productName;
    product.productPrice = productPrice || product.productPrice;
    product.productTitle = productTitle || product.productTitle;
    product.productShortDescription =
      productShortDescription || product.productShortDescription;
    product.productLongDescription =
      productLongDescription || product.productLongDescription;
    product.productDetails = productDetails || product.productDetails;
    product.productImages = productImages || product.productImages;
    product.categoryIds = categoryIds || product.categoryIds;
    product.tagsAndKeywords = tagsAndKeywords || product.tagsAndKeywords;
    product.discount = discount !== undefined ? discount : product.discount;
    product.couponCodes = couponCodes || product.couponCodes;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/products/:id
// Deletes a product by ID (admin/seller only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PATCH /api/products/:id/rating
// Updates product rating and number of reviews (admin/seller only for validation)
export const updateProductRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }

    // Update rating and increment number of reviews
    const currentTotalRating = product.averageRating * product.numberOfReviews;
    product.numberOfReviews += 1;
    product.averageRating =
      (currentTotalRating + rating) / product.numberOfReviews;

    await product.save();

    res.status(200).json({
      message: "Product rating updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
