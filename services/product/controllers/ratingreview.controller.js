// ratingReview.controller.js
// Handles rating and review operations for users and admins/sellers

import RatingsAndReviews from "#shared/models/RatingReview.js";
import Product from "#shared/models/Product.js";

// --- User-facing functions ---

// POST /api/ratings
// Creates a new rating and review for a product (authenticated users only)
export const createRatingReview = async (req, res) => {
  try {
    const { productId, ratings, reviewDescription } = req.body;
    const userId = req.user._id; // From authenticateJWT middleware

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create rating/review
    const ratingReview = new RatingsAndReviews({
      productId,
      userId,
      ratings,
      reviewDescription,
    });

    await ratingReview.save();

    // Update product's average rating and number of reviews
    const reviews = await RatingsAndReviews.find({ productId });
    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.ratings,
      0
    );
    product.numberOfReviews = reviews.length;
    product.averageRating = totalRatings / reviews.length;
    await product.save();

    res.status(201).json({
      message: "Rating and review created successfully",
      ratingReview,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "User has already reviewed this product" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/ratings/product/:productId
// Fetches all ratings and reviews for a specific product
export const getRatingsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const ratings = await RatingsAndReviews.find({ productId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Ratings and reviews fetched successfully",
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/ratings/user
// Fetches all ratings and reviews by the authenticated user
export const getUserRatings = async (req, res) => {
  try {
    const userId = req.user._id; // From authenticateJWT middleware
    const ratings = await RatingsAndReviews.find({ userId })
      .populate("productId", "productName productTitle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User ratings and reviews fetched successfully",
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Admin/Seller-facing functions ---

// PUT /api/ratings/:id
// Updates a rating and review by ID (admin/seller or review owner only)
export const updateRatingReview = async (req, res) => {
  try {
    const { ratings, reviewDescription } = req.body;
    const ratingReview = await RatingsAndReviews.findById(req.params.id);
    if (!ratingReview) {
      return res.status(404).json({ message: "Rating and review not found" });
    }

    // Check if user is the review owner or an admin/seller
    if (
      ratingReview.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "seller"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    // Update fields
    ratingReview.ratings = ratings || ratingReview.ratings;
    ratingReview.reviewDescription =
      reviewDescription || ratingReview.reviewDescription;
    await ratingReview.save();

    // Update product's average rating and number of reviews
    const reviews = await RatingsAndReviews.find({
      productId: ratingReview.productId,
    });
    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.ratings,
      0
    );
    const product = await Product.findById(ratingReview.productId);
    product.numberOfReviews = reviews.length;
    product.averageRating = totalRatings / reviews.length;
    await product.save();

    res.status(200).json({
      message: "Rating and review updated successfully",
      ratingReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/ratings/:id
// Deletes a rating and review by ID (admin/seller or review owner only)
export const deleteRatingReview = async (req, res) => {
  try {
    const ratingReview = await RatingsAndReviews.findById(req.params.id);
    if (!ratingReview) {
      return res.status(404).json({ message: "Rating and review not found" });
    }

    // Check if user is the review owner or an admin/seller
    if (
      ratingReview.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "seller"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    const productId = ratingReview.productId;
    await ratingReview.deleteOne();

    // Update product's average rating and number of reviews
    const reviews = await RatingsAndReviews.find({ productId });
    const product = await Product.findById(productId);
    product.numberOfReviews = reviews.length;
    product.averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.ratings, 0) /
          reviews.length
        : 0;
    await product.save();

    res.status(200).json({ message: "Rating and review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/ratings
// Fetches all ratings and reviews (admin/seller only)
export const getAllRatings = async (req, res) => {
  try {
    const ratings = await RatingsAndReviews.find()
      .populate("userId", "name email")
      .populate("productId", "productName productTitle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All ratings and reviews fetched successfully",
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
