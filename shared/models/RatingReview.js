import mongoose from "mongoose";

const ratingsAndReviewsSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviewDescription: {
      type: String,
      trim: true,
      maxlength: [1000, "Review description cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only leave one review per product
ratingsAndReviewsSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Index product ID for faster review retrieval for a product
ratingsAndReviewsSchema.index({ productId: 1 });

const RatingsAndReviews = mongoose.model(
  "RatingsAndReviews",
  ratingsAndReviewsSchema
);
export default RatingsAndReviews;
