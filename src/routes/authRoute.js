// src/routes/authRoutes.js
import express from "express";
import { registerMedico, loginMedico } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerMedico);
router.post("/login", loginMedico);

export default router;
