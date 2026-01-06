// routes/usertraining.routes.js
import express from "express";
import { protect } from "../middleware/isAuthenticated.js";
import {
  selectTraining,
  getMyTraining,
  getUserSelections,
  getAllSelections,
} from "../controllers/usertraining.controller.js";

const router = express.Router();

// User selects a training
router.post("/select-training", protect, selectTraining);

// Get logged-in user's selected training
router.get("/my-training", protect, getMyTraining);

// Get all trainings selected by the user
router.get("/my-selections", protect, getUserSelections);

// Get all selections (admin view)
router.get("/all-selections", protect, getAllSelections);

export default router;
