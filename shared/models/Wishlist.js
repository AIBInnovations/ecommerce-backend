import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user should have only one wishlist
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          // Quantity might not be strictly necessary for a wishlist but can be useful
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index user ID for faster wishlist retrieval
wishlistSchema.index({ userId: 1 });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
