// category.controller.js
// Handles category-related operations for users and admins/sellers

import Category from "#shared/models/Category.js";
import Product from "#shared/models/Product.js";

// --- User-facing functions ---

// GET /api/categories
// Fetches all categories with optional parentCategory filter
export const getAllCategories = async (req, res) => {
  try {
    const { parentCategory } = req.query;
    const query = parentCategory ? { parentCategory } : {};
    const categories = await Category.find(query).populate(
      "parentCategory",
      "name slug"
    );
    res.status(200).json({
      message: "Categories fetched successfully",
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/categories/:id
// Fetches a category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parentCategory",
      "name slug"
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/categories/slug/:slug
// Fetches a category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate(
      "parentCategory",
      "name slug"
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Admin/Seller-facing functions ---

// POST /api/categories
// Creates a new category (admin/seller only)
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, parentCategory } = req.body;

    // Check if name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category name or slug already in use" });
    }

    // Verify parent category exists if provided
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({ message: "Parent category not found" });
      }
    }

    const category = new Category({
      name,
      slug,
      description,
      parentCategory: parentCategory || null,
    });

    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/categories/:id
// Updates a category by ID (admin/seller only)
export const updateCategory = async (req, res) => {
  try {
    const { name, slug, description, parentCategory } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if new name or slug is already in use by another category
    if ((name && name !== category.name) || (slug && slug !== category.slug)) {
      const existingCategory = await Category.findOne({
        $or: [{ name }, { slug }],
      });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category name or slug already in use" });
      }
    }

    // Verify parent category exists if provided
    if (
      parentCategory &&
      parentCategory !== category.parentCategory?.toString()
    ) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(400).json({ message: "Parent category not found" });
      }
      // Prevent circular reference
      if (parentCategory === req.params.id) {
        return res
          .status(400)
          .json({ message: "Category cannot be its own parent" });
      }
    }

    // Update fields
    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.description = description || category.description;
    category.parentCategory =
      parentCategory !== undefined ? parentCategory : category.parentCategory;

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/categories/:id
// Deletes a category by ID (admin/seller only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category has subcategories
    const subcategories = await Category.find({
      parentCategory: req.params.id,
    });
    if (subcategories.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with subcategories" });
    }

    // Check if category is used by products
    const products = await Product.find({ categoryIds: req.params.id });
    if (products.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category used by products" });
    }

    await category.deleteOne();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
