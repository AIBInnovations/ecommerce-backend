import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // You might want to store the product price at the time of order for historical accuracy
        priceAtOrder: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    cartTotal: {
      // Total before any discounts
      type: Number,
      required: true,
      min: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    purchasePrice: {
      // Final price after all discounts
      type: Number,
      required: true,
      min: 0,
    },
    address: {
      // Store the address details at the time of order for historical accuracy
      houseNo: {
        type: String,
        trim: true,
      },
      buildingNameOrLocality: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      pinCode: {
        type: String,
        trim: true,
      },
    },
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "cancelled", "delivered"], // Added 'processing', 'shipped' for better tracking
      default: "placed",
    },
    deliveryStatus: {
      dispatched: {
        status: {
          type: Boolean,
          default: false,
        },
        dispatchedAt: {
          type: Date,
          default: null,
        },
      },
      inTransit: {
        // Renamed from 'tranist' for clarity
        status: {
          type: Boolean,
          default: false,
        },
        inTransitAt: {
          // Timestamp for when it entered transit
          type: Date,
          default: null,
        },
      },
      delivered: {
        status: {
          type: Boolean,
          default: false,
        },
        deliveredAt: {
          type: Date,
          default: null,
        },
      },
    },
    paymentStatus: {
      // Added payment status
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    paymentMethod: {
      // Added payment method
      type: String,
      enum: ["COD", "Card", "UPI", "NetBanking"], // Example methods
    },
    trackingNumber: {
      // Added tracking number
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index user ID and order status for efficient queries
orderSchema.index({ userId: 1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
