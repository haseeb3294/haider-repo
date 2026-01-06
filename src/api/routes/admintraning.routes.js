import express from "express";
import {
  createTraining,
  getAllTrainings,
  updateTraining,
  deleteTraining,
} from "../controllers/admintraining.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Add new training
router.post("/createTraining", upload.single("trainingImage"), createTraining);

// Get all trainings
router.get("/getAllTrainings", getAllTrainings);

// Update a training
router.put("/updateTraining/:id", upload.single("trainingImage"), updateTraining);

// Delete a training
router.delete("/deleteTraining/:id", deleteTraining);

export default router;
