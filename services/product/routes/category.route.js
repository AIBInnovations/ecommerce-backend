// category.route.js
// Defines routes for category management, split into user and admin/seller endpoints

import express from "express";
import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
// import { authenticateJWT } from "./auth.middleware.js";
// import { restrictToAdmin } from "./admin.middleware.js";

const router = express.Router();

// --- User-facing routes ---

// GET /api/categories
// Route to fetch all categories
router.get("/", getAllCategories);

// GET /api/categories/:id
// Route to fetch a category by ID
router.get("/:id", getCategoryById);

// GET /api/categories/slug/:slug
// Route to fetch a category by slug
router.get("/slug/:slug", getCategoryBySlug);

// --- Admin/Seller-facing routes ---

// POST /api/categories
// Route to create a new category (admin/seller only)
router.post("/", createCategory);

// PUT /api/categories/:id
// Route to update a category by ID (admin/seller only)
router.put("/:id", updateCategory);

// DELETE /api/categories/:id
// Route to delete a category by ID (admin/seller only)
router.delete("/:id", deleteCategory);

export default router;
