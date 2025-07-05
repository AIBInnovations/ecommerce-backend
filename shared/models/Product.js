import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    productTitle: {
      type: String,
      required: true,
      trim: true,
    },
    productShortDescription: {
      type: String,
      required: true,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    productLongDescription: {
      type: String,
      required: true,
    },
    productDetails: {
      // Could be an object for more structured details like dimensions, weight, material, etc.
      type: String, // Or mongoose.Schema.Types.Mixed if structure varies
    },
    productImages: [
      {
        type: String, // Cloudinary public URL
      },
    ],
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Assuming you'll have a Category model
      },
    ],
    tagsAndKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100, // Percentage discount
    },
    couponCodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon", // Reference to a Coupon model
      },
    ],
    // You might want to add a field for average rating or number of reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index product name for faster search
productSchema.index({ productName: 1 });
productSchema.index({ categoryIds: 1 });
productSchema.index({ tagsAndKeywords: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
