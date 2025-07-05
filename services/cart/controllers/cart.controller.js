// cart.controller.js
// Handles cart-related operations for users and admins/sellers

import Cart from "#shared/models/Cart.js";
import Product from "#shared/models/Product.js";

// --- User-facing functions ---

// GET /api/cart
// Fetches the authenticated user's cart
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id; // From authenticateJWT middleware
    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "productName productPrice productTitle productImages"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/cart
// Adds a product to the authenticated user's cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // From authenticateJWT middleware

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create new cart if none exists
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      // Check if product already in cart
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (productIndex > -1) {
        // Update quantity if product exists
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new product to cart
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();

    // Populate product details for response
    await cart.populate(
      "products.productId",
      "productName productPrice productTitle productImages"
    );
    res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/cart
// Updates the quantity of a product in the authenticated user's cart
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // From authenticateJWT middleware

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      // Remove product if quantity is 0 or negative
      cart.products.splice(productIndex, 1);
    } else {
      // Update quantity
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();

    // Populate product details for response
    await cart.populate(
      "products.productId",
      "productName productPrice productTitle productImages"
    );
    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/cart/product/:productId
// Removes a product from the authenticated user's cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id; // From authenticateJWT middleware

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    // Populate product details for response
    await cart.populate(
      "products.productId",
      "productName productPrice productTitle productImages"
    );
    res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/cart
// Clears the authenticated user's cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id; // From authenticateJWT middleware
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = [];
    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Admin/Seller-facing functions ---

// GET /api/cart/all
// Fetches all carts (admin/seller only)
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("userId", "name email")
      .populate(
        "products.productId",
        "productName productPrice productTitle productImages"
      )
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "All carts fetched successfully",
      count: carts.length,
      carts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/cart/user/:userId
// Fetches a specific user's cart (admin/seller only)
export const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId })
      .populate("userId", "name email")
      .populate(
        "products.productId",
        "productName productPrice productTitle productImages"
      );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
