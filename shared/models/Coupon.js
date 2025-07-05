// Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      // Percentage or fixed amount
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minPurchaseAmount: {
      // Minimum order value to apply coupon
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscountAmount: {
      // Max discount for percentage coupons
      type: Number,
      default: null,
      min: 0,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // You could add fields like usage limits, per user limits, etc.
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ code: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
