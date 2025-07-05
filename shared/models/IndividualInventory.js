import mongoose from "mongoose";

const individualInventorySchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming sellers are also users, or you'd have a separate Seller model
      default: "60c72b2f9c1b3c0015f6e8e8", // Example Admin user ID - replace with your actual Admin ID
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
          min: [0, "Quantity cannot be negative"],
        },
        productAdded: {
          // Timestamp when this product was added to this specific seller's inventory
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index seller ID for faster inventory retrieval for a seller
individualInventorySchema.index({ sellerId: 1 });

const IndividualInventory = mongoose.model(
  "IndividualInventory",
  individualInventorySchema
);
export default IndividualInventory;
