// wishlist.controller.js
// Handles wishlist-related operations for users and admins/sellers

import Wishlist from "#shared/models/Wishlist.js";
import Product from "#shared/models/Product.js";

// --- User-facing functions ---

// GET /api/wishlist
// Fetches the authenticated user's wishlist
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // From authenticateJWT middleware
    const wishlist = await Wishlist.findOne({ userId }).populate(
      "products.productId",
      "productName productPrice productTitle productImages"
    );
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res.status(200).json({
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/wishlist
// Adds a product to the authenticated user's wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // From authenticateJWT middleware

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      // Create new wishlist if none exists
      wishlist = new Wishlist({ userId, products: [{ productId, quantity }] });
      زام;
    } else {
      // Check if product already in wishlist
      const productIndex = wishlist.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (productIndex > -1) {
        // Update quantity if product exists
        wishlist.products[productIndex].quantity =
          quantity || wishlist.products[productIndex].quantity;
      } else {
        // Add new product to wishlist
        wishlist.products.push({ productId, quantity });
      }
    }

    await wishlist.save();

    // Populate product details for response
    await wishlist.populate(
      "products.productId",
      "productName productPrice productTitle productImages"
    );
    res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/wishlist
// Updates the quantity of a product in the authenticated user's wishlist
export const updateWishlistItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // From authenticateJWT middleware

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const productIndex = wishlist.products.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    if (quantity <= 0) {
      // Remove product if quantity is 0 or negative
      wishlist.products.splice(productIndex, 1);
    } else {
      // Update quantity
      wishlist.products[productIndex].quantity = quantity;
    }

    await wishlist.save();

    // Populate product details for response
    await wishlist.populate(
      "products.productId",
      "productName productPrice productTitle productImages"
    );
    res.status(200).json({
      message: "Wishlist updated successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/wishlist/product/:productId
// Removes a product from the authenticated user's wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id; // From authenticateJWT middleware

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const productIndex = wishlist.products.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    // Populate product details for response
    await wishlist.populate(
      "products.productId",
      "productName productPrice productTitle productImages"
    );
    res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/wishlist
// Clears the authenticated user's wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // From authenticateJWT middleware
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      message: "Wishlist cleared successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Admin/Seller-facing functions ---

// GET /api/wishlist/all
// Fetches all wishlists (admin/seller only)
export const getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find()
      .populate("userId", "name email")
      .populate(
        "products.productId",
        "productName productPrice productTitle productImages"
      )
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "All wishlists fetched successfully",
      count: wishlists.length,
      wishlists,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/wishlist/user/:userId
// Fetches a specific user's wishlist (admin/seller only)
export const getWishlistByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ userId })
      .populate("userId", "name email")
      .populate(
        "products.productId",
        "productName productPrice productTitle productImages"
      );
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res.status(200).json({
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
