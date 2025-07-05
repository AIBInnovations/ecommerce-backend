// userAuth.route.js
// Defines routes for user authentication

import express from "express";
import { register, login } from "../controllers/userAuth.controller.js";

const router = express.Router();

// POST /api/auth/register
// Route to register a new user
router.post("/register", register);

// POST /api/auth/login
// Route to authenticate a user
router.post("/login", login);

export default router;
