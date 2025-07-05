// user.route.js
// Defines routes for user management

import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// GET /api/users
// Route to fetch all users
router.get("/", getAllUsers);

// GET /api/users/:id
// Route to fetch a user by ID
router.get("/:id", getUserById);

// GET /api/users/email/:email
// Route to fetch a user by email
router.get("/email/:email", getUserByEmail);

// GET /api/users/phone/:phone
// Route to fetch a user by phone number
router.get("/phone/:phone", getUserByPhone);

// PUT /api/users/:id
// Route to update user details
router.put("/:id", updateUser);

// DELETE /api/users/:id
// Route to delete a user
router.delete("/:id", deleteUser);

export default router;
