// coupon.controller.js
// Handles coupon-related operations for users and admins/sellers

import Coupon from "#shared/models/Coupon.js";
import Product from "#shared/models/Product.js";

// --- User-facing functions ---

// POST /api/coupons/validate
// Validates a coupon code and checks applicability
export const validateCoupon = async (req, res) => {
  try {
    const { code, productIds } = req.body; // Optional productIds for specific product checks

    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or inactive" });
    }

    // Check expiration
    if (new Date() > coupon.expirationDate) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // Optionally check if coupon applies to specific products
    let applicable = true;
    if (productIds && productIds.length > 0) {
      const products = await Product.find({ _id: { $in: productIds } });
      if (products.length !== productIds.length) {
        return res.status(400).json({ message: "Some products not found" });
      }
      // Check if coupon is linked to any of the products
      const couponProducts = await Product.find({ couponCodes: coupon._id });
      applicable = couponProducts.some((p) =>
        productIds.includes(p._id.toString())
      );
    }

    if (!applicable) {
      return res
        .status(400)
        .json({ message: "Coupon not applicable to these products" });
    }

    res.status(200).json({
      message: "Coupon is valid",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchaseAmount: coupon.minPurchaseAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        expirationDate: coupon.expirationDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/coupons
// Fetches all active coupons
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expirationDate: { $gte: new Date() },
    });
    res.status(200).json({
      message: "Active coupons fetched successfully",
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Admin/Seller-facing functions ---

// POST /api/coupons
// Creates a new coupon (admin/seller only)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      expirationDate,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already in use" });
    }

    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      expirationDate,
      isActive: true,
    });

    await coupon.save();

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/coupons/:id
// Updates a coupon by ID (admin/seller only)
export const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      expirationDate,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Check if new code is already in use by another coupon
    if (code && code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code });
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon code already in use" });
      }
    }

    // Update fields
    coupon.code = code || coupon.code;
    coupon.discountType = discountType || coupon.discountType;
    coupon.discountValue = discountValue || coupon.discountValue;
    coupon.minPurchaseAmount =
      minPurchaseAmount !== undefined
        ? minPurchaseAmount
        : coupon.minPurchaseAmount;
    coupon.maxDiscountAmount =
      maxDiscountAmount !== undefined
        ? maxDiscountAmount
        : coupon.maxDiscountAmount;
    coupon.expirationDate = expirationDate || coupon.expirationDate;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

    await coupon.save();

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/coupons/:id
// Deletes a coupon by ID (admin/seller only)
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Remove coupon from associated products
    await Product.updateMany(
      { couponCodes: coupon._id },
      { $pull: { couponCodes: coupon._id } }
    );

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/coupons/:id
// Fetches a coupon by ID (admin/seller only)
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({
      message: "Coupon fetched successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/coupons/all
// Fetches all coupons, including inactive ones (admin/seller only)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All coupons fetched successfully",
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
