import mongoose from "mongoose";

const masterInventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true, // Each product should have only one master inventory entry
    },
    productQuantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index product ID for quick inventory checks
masterInventorySchema.index({ productId: 1 });

const MasterInventory = mongoose.model(
  "MasterInventory",
  masterInventorySchema
);
export default MasterInventory;
