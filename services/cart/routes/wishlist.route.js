// wishlist.route.js
// Defines routes for wishlist management, split into user and admin/seller endpoints

import express from "express";
import {
  getUserWishlist,
  addToWishlist,
  updateWishlistItem,
  removeFromWishlist,
  clearWishlist,
  getAllWishlists,
  getWishlistByUserId,
} from "../controllers/wishlist.controller.js";
// import { authenticateJWT } from "./auth.middleware.js";
// import { restrictToAdmin } from "./admin.middleware.js";

const router = express.Router();

// --- User-facing routes (authenticated) ---

// GET /api/wishlist
// Route to fetch the authenticated user's wishlist
router.get("/", authenticateJWT, getUserWishlist);

// POST /api/wishlist
// Route to add a product to the authenticated user's wishlist
router.post("/", authenticateJWT, addToWishlist);

// PUT /api/wishlist
// Route to update the quantity of a product in the authenticated user's wishlist
router.put("/", authenticateJWT, updateWishlistItem);

// DELETE /api/wishlist/product/:productId
// Route to remove a product from the authenticated user's wishlist
router.delete("/product/:productId", authenticateJWT, removeFromWishlist);

// DELETE /api/wishlist
// Route to clear the authenticated user's wishlist
router.delete("/", authenticateJWT, clearWishlist);

// --- Admin/Seller-facing routes ---

// GET /api/wishlist/all
// Route to fetch all wishlists (admin/seller only)
router.get("/all", authenticateJWT, restrictToAdmin, getAllWishlists);

// GET /api/wishlist/user/:userId
// Route to fetch a specific user's wishlist (admin/seller only)
router.get(
  "/user/:userId",
  authenticateJWT,
  restrictToAdmin,
  getWishlistByUserId
);

export default router;
