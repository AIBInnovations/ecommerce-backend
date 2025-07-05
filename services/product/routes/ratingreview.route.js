// ratingReview.route.js
// Defines routes for rating and review management, split into user and admin/seller endpoints

import express from "express";
import {
  createRatingReview,
  getRatingsByProduct,
  getUserRatings,
  updateRatingReview,
  deleteRatingReview,
  getAllRatings,
} from "../controllers/ratingreview.controller.js";
// import { authenticateJWT } from "./auth.middleware.js";
// import { restrictToAdmin } from "./admin.middleware.js";

const router = express.Router();

// --- User-facing routes ---

// POST /api/ratings
// Route to create a new rating and review (authenticated users only)
router.post("/", createRatingReview);

// GET /api/ratings/product/:productId
// Route to fetch all ratings and reviews for a specific product
router.get("/product/:productId", getRatingsByProduct);

// GET /api/ratings/user
// Route to fetch all ratings and reviews by the authenticated user
router.get("/user", getUserRatings);

// --- Admin/Seller-facing routes ---

// PUT /api/ratings/:id
// Route to update a rating and review (admin/seller or review owner only)
router.put("/:id", updateRatingReview);

// DELETE /api/ratings/:id
// Route to delete a rating and review (admin/seller or review owner only)
router.delete("/:id", deleteRatingReview);

// GET /api/ratings
// Route to fetch all ratings and reviews (admin/seller only)
router.get("/", getAllRatings);

export default router;
