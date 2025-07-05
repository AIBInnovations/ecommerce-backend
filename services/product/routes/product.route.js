// product.route.js
// Defines routes for product management, split into user and admin/seller endpoints

import express from "express";
import {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductRating,
} from "../controllers/product.controller.js";
// import { authenticateJWT } from "./auth.middleware.js";
// import { restrictToAdmin } from "./admin.middleware.js";

const router = express.Router();

// --- User-facing routes (public) ---

// GET /api/products
// Route to fetch all products with optional filters
router.get("/", getAllProducts);

// GET /api/products/:id
// Route to fetch a single product by ID
router.get("/:id", getProductById);

// GET /api/products/search
// Route to search products by name or description
router.get("/search", searchProducts);

// --- Admin/Seller-facing routes (protected) ---

// POST /api/products
// Route to create a new product (admin/seller only)
router.post("/", createProduct);

// PUT /api/products/:id
// Route to update a product by ID (admin/seller only)
router.put("/:id", updateProduct);

// DELETE /api/products/:id
// Route to delete a product by ID (admin/seller only)
router.delete("/:id", deleteProduct);

// PATCH /api/products/:id/rating
// Route to update product rating (admin/seller only for validation)
router.patch("/:id/rating", updateProductRating);

export default router;
