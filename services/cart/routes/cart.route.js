// cart.route.js
// Defines routes for cart management, split into user and admin/seller endpoints

import express from "express";
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getAllCarts,
  getCartByUserId,
} from "../controllers/cart.controller.js";
// import { authenticateJWT } from "./auth.middleware.js";
// import { restrictToAdmin } from "./admin.middleware.js";

const router = express.Router();

// --- User-facing routes (authenticated) ---

// GET /api/cart
// Route to fetch the authenticated user's cart
router.get("/", authenticateJWT, getUserCart);

// POST /api/cart
// Route to add a product to the authenticated user's cart
router.post("/", authenticateJWT, addToCart);

// PUT /api/cart
// Route to update the quantity of a product in the authenticated user's cart
router.put("/", authenticateJWT, updateCartItem);

// DELETE /api/cart/product/:productId
// Route to remove a product from the authenticated user's cart
router.delete("/product/:productId", authenticateJWT, removeFromCart);

// DELETE /api/cart
// Route to clear the authenticated user's cart
router.delete("/", authenticateJWT, clearCart);

// --- Admin/Seller-facing routes ---

// GET /api/cart/all
// Route to fetch all carts (admin/seller only)
router.get("/all", authenticateJWT, restrictToAdmin, getAllCarts);

// GET /api/cart/user/:userId
// Route to fetch a specific user's cart (admin/seller only)
router.get("/user/:userId", authenticateJWT, restrictToAdmin, getCartByUserId);

export default router;
