// coupon.route.js
// Defines routes for coupon management, split into user and admin/seller endpoints

import express from "express";
import {
  validateCoupon,
  getActiveCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  getAllCoupons,
} from "../controllers/coupon.controller.js";
// import { authenticateJWT } from "./auth.middleware.js";
// import { restrictToAdmin } from "./admin.middleware.js";

const router = express.Router();

// --- User-facing routes ---

// POST /api/coupons/validate
// Route to validate a coupon code
router.post("/validate", validateCoupon);

// GET /api/coupons
// Route to fetch all active coupons
router.get("/", getActiveCoupons);

// --- Admin/Seller-facing routes ---

// POST /api/coupons
// Route to create a new coupon (admin/seller only)
router.post("/", createCoupon);

// PUT /api/coupons/:id
// Route to update a coupon by ID (admin/seller only)
router.put("/:id", updateCoupon);

// DELETE /api/coupons/:id
// Route to delete a coupon by ID (admin/seller only)
router.delete("/:id", deleteCoupon);

// GET /api/coupons/:id
// Route to fetch a coupon by ID (admin/seller only)
router.get("/:id", getCouponById);

// GET /api/coupons/all
// Route to fetch all coupons, including inactive (admin/seller only)
router.get("/all", getAllCoupons);

export default router;
